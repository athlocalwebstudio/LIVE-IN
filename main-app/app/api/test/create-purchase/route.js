import { prisma } from "@/lib/prisma";

export async function POST(){

  const purchase = await prisma.purchase.create({
    data:{
      userId:"cms56wtml000fwouilxb869od",
      gameId:"cms57f4vi000hwouinm4qqwvb",

      provider:"developer-test",

      externalId:"test-order-001",

      status:"active"
    }
  });


  return Response.json(purchase);

}