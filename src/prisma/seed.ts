import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readlineSync from 'readline-sync';
import { getCurrentDate } from '../sharedComponents/utilities/date.util';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedGeneralDatas() {
    const sqlFilePath = path.join(__dirname, './seeder.sql'); // Cseréld ki a fájl útvonalát
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8'); // Fájl beolvasása

    console.log('Seeding database...');
    const queries = sqlContent.split(';');

    try {
        for (const query of queries) {
            if (query.trim()) {
                await prisma.$executeRawUnsafe(query);
            }
        }
        console.log('Seeding done!');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await prisma.$disconnect(); // Prisma kapcsolódás bontása
    }
}

async function seedAdmin() {
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

    const admin = await prisma.users.create({
        data: {
            username: username,
            email: email,
            password: await bcrypt.hash(password, 2),
            is_guest: false,
            registration_date: getCurrentDate()
        }
    })

    const adminRoles = await prisma.rights.findMany()

    adminRoles.forEach(async (role) => {
        await prisma.users_rights.create({
            data: {
                user: admin.id,
                right: role.id,
            }
        })
    })

    console.log('Admin user seeded successfully!');
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
