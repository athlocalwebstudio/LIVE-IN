import { prisma } from "@/lib/prisma";

export async function POST(){

  const release = await prisma.gameRelease.create({
    data:{
      gameId:"cms57f4vi000hwouinm4qqwvb",
      version:"4.5",
      fileName:"Red VS Blue - Tiktok live game.exe",
      sha256:"test-hash",
      sizeBytes:1000000,
      objectKey:"games/red-vs-blue/v4.5/game.zip",
      published:true
    }
  });


  return Response.json(release);

}