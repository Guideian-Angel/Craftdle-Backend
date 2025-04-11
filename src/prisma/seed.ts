import * as fs from 'fs';
import * as path from 'path';
import * as readlineSync from 'readline-sync';
import * as bcrypt from 'bcrypt';
import { AssetsService } from './../assets/assets.service';
import { TokenService } from './../token/token.service';
import { SettingsService } from './../settings/settings.service';
import { AuthorizationService } from './../authorization/authorization.service';
import { PrismaService } from './prisma.service';
import { UsersService } from './../users/users.service';

const prisma = new PrismaService();
const tokenService = new TokenService(prisma);
const assetsService = new AssetsService(prisma, tokenService);
const settingsService = new SettingsService(prisma, tokenService);
const authorizationService = new AuthorizationService(prisma);
const usersService = new UsersService(prisma, assetsService, tokenService, settingsService, authorizationService);

async function seedGeneralDatas() {
    try {
        const sqlFilePath = path.join(__dirname, './seeder.sql'); // Cseréld ki a fájl útvonalát
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8'); // Fájl beolvasása
        
        console.log('Seeding database...');
        const queries = sqlContent.split(';');
        
        for (const query of queries) {
            if (query.trim()) {
                await prisma.$executeRawUnsafe(query);
            }
        }
        console.log('Seeding done!');
    } catch (error) {
        throw new Error('Error during seeding: ' + error);
    } finally {
        await prisma.$disconnect(); // Prisma kapcsolódás bontása
    }
}

async function seedAdmin() {
    try {

        const username = readlineSync.question('Please enter the admin username: ');
    
        let email: string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        do {
            email = readlineSync.question('Please enter the admin email: ');
            if (!emailRegex.test(email)) {
                console.log('Invalid email format. Please try again.');
            }
        } while (!emailRegex.test(email));
    
        const password = readlineSync.questionNewPassword('Please enter the admin password: ');
    
        console.log('Admin user will be seeded with the username:', username);
    
        await usersService.register({
            username: username,
            email: email,
            password: password,
            stayLoggedIn: false,
        });
    
        const admin = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        
        const adminRoles = await prisma.rights.findMany();
    
        await Promise.all(adminRoles.map(async (role) => {
            await prisma.users_rights.create({
                data: {
                    user: admin.id,
                    right: role.id,
                }
            });
        }));
    
        console.log('Admin user seeded successfully!');
    } catch {
        throw new Error('Username or email already exists!');
    }
}

async function askToSeedAdmin() {
    const answer = readlineSync.question('Would you like to seed an admin user? (yes/no): ');
    if (answer.toLowerCase() === 'yes') {
        await seedAdmin();
    } else {
        console.log('Skipping admin user seeding.');
    }
}

async function main() {
    try {
        await seedGeneralDatas();
        await askToSeedAdmin();
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

main();
