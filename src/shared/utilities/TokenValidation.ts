import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import tokenEncryption from './encryptingAndDecodingToken';

async function validateBasicToken(authorization: string, prisma: PrismaService) {
    if (!authorization || !authorization.startsWith('Basic ')) {
        throw new UnauthorizedException('Authorization header is missing or invalid.');
    }
    // Alap dekódolás
    const base64Credentials = authorization.split(' ')[1]; // "Basic <base64(username:token)>"
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, token] = credentials.split(':');

    if (!username || !token) {
        throw new UnauthorizedException('Invalid Basic Auth credentials.');
    }

    const user = await validateToken(token, prisma);
    if (!user) {
        throw new HttpException("Invalid token.", HttpStatus.UNAUTHORIZED);
    }
    return user;
}

async function validateBearerToken(authorization: string, prisma: PrismaService) {
    if (!authorization) {
        throw new UnauthorizedException('Authorization header is required');
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
        throw new UnauthorizedException('Token is missing');
    }

    const user = await validateToken(token, prisma);
    if (!user) {
        throw new HttpException("Invalid token.", HttpStatus.UNAUTHORIZED);
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
    console.log(tokenEncryption.encryptUuid(token))
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