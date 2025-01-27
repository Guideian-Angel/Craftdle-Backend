import { PrismaService } from "src/prisma/prisma.service";

export async function RandomizePasswordResetImages(prisma: PrismaService){
    const images = await prisma.collections.findMany();
    const randomIndexes = Array.from({ length: 3 }, () => Math.floor(Math.random() * images.length));
    const correctIndex = Math.floor(Math.random() * 3);
    console.log(randomIndexes, correctIndex);
    return randomIndexes.map((index, i) => ({
        id: images[index].id,
        item_id: images[index].item_id,
        name: images[index].name,
        src: images[index].src,
        isRight: i === correctIndex,
    }));
}