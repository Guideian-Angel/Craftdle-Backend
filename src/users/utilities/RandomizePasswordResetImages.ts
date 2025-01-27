import { PrismaService } from "src/prisma/prisma.service";

export async function RandomizePasswordResetImages(prisma: PrismaService){
    const images = await prisma.collections.findMany();
    const randomImagesSrc = new Set()
    const randomIndexes = [];
    while (randomImagesSrc.size < 3) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if(!randomImagesSrc.has(images[randomIndex].src)){
            randomImagesSrc.add(images[randomIndex].src);
            randomIndexes.push(randomIndex);
        };
    }
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