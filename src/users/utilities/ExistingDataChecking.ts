export async function checkIfUserExists(username: string, email: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });

    if (existingUser) {
        throw new Error('Username or email already exists.');
    }
}