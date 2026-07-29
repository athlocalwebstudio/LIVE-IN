import { prisma } from "@/lib/prisma";

export async function POST(){

  const game = await prisma.game.create({
    data:{
      slug:"red-vs-blue",
      title:"Red VS Blue",
      itchGameId:"test-game-id",
      purchaseUrl:"https://iliaskot.itch.io/new-tiktok-live-game"
    }
  });


  return Response.json(game);

}