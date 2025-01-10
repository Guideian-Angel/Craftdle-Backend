import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import tokenEncryption from './encryptingAndDecodingToken';

/**
 * Alap (Basic Auth) token validálása.
 * A token a következő formátumban érkezik: `Basic <base64(username:token)>`.
 * A függvény a `username` és a hozzá tartozó `token` alapján azonosítja a felhasználót.
 * @param authorization - Az `authorization` fejléc tartalma (Basic token).
 * @param prisma - A Prisma szolgáltatás példánya.
 * @returns Az érvényes tokenhez tartozó felhasználó adatai.
 * @throws UnauthorizedException, ha a token érvénytelen vagy hiányzik.
 */
async function validateBasicToken(authorization: string, prisma: PrismaService) {
    if (!authorization || !authorization.startsWith('Basic ')) {
        throw new UnauthorizedException('Az Authorization fejléc hiányzik vagy érvénytelen.');
    }

    // Alap dekódolás: a "Basic" prefix eltávolítása és base64 dekódolás
    const base64Credentials = authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, token] = credentials.split(':');

    if (!username || !token) {
        throw new UnauthorizedException('Az Authorization fejlécben hiányosak a hitelesítési adatok.');
    }

    // Token validálása
    const user = await validateToken(token, prisma);
    if (!user) {
        throw new HttpException('Érvénytelen token.', HttpStatus.UNAUTHORIZED);
    }

    return user;
}

/**
 * Bearer token validálása.
 * @param authorization - Az `authorization` header tartalma.
 * @param prisma - A Prisma szolgáltatás példánya.
 * @param forUserLogin - Flag, amely jelzi, hogy bejelentkezéskor fut-e.
 * @returns Az érvényes tokenhez tartozó felhasználó adatai vagy `null`.
 */
async function validateBearerToken(authorization: string, prisma: PrismaService, forUserLogin: boolean = false) {
    if (!authorization) {
        if (forUserLogin) {
            return null; // Ha a bejelentkezési folyamat része, nem dob hibát
        }
        throw new UnauthorizedException("Token nem található.");
    }

    const token = authorization.replace('Bearer ', ''); // Bearer prefix eltávolítása
    if (!token) {
        throw new UnauthorizedException('Token hiányzik.');
    }

    const user = await validateToken(token, prisma);
    if (!user) {
        throw new HttpException("Érvénytelen token.", HttpStatus.UNAUTHORIZED);
    }
    return user;
}

async function getUserById(userId: number, prisma: PrismaService) {
    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            throw new HttpException(`User with ID ${userId} not found.`, HttpStatus.NOT_FOUND);
        }
        return user;
    } catch (error) {
        throw new HttpException("Failed to retrieve user data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function getTokensByUserId(userId: number, prisma: PrismaService) {
    try {
        return await prisma.tokens.findMany({ where: { user: userId } });
    } catch (error) {
        throw new HttpException("Failed to retrieve tokens.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function validateToken(token: string, prisma: PrismaService, forUuidGeneration: boolean = false) {
    const tokenQuery = await prisma.tokens.findFirst({
        where: { login_token: tokenEncryption.encryptUuid(token) }
    });
    
    if (!tokenQuery) {
        if (forUuidGeneration) {
            return null;  // Ha UUID generálunk, nem dobunk hibát, csak null-t adunk vissza
        }
        throw new UnauthorizedException("Token not found.");
    }

    return await getUserById(tokenQuery.user, prisma);
}

const tokenValidation = {
    validateBasicToken,
    validateBearerToken,
    validateToken
}

export default tokenValidation;