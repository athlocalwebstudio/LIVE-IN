import { prisma } from "@/lib/prisma";

export async function POST(){

  const purchase = await prisma.purchase.findUnique({
    where:{
      externalId:"test-order-001"
    }
  });


  if(!purchase){
    return Response.json(
      {error:"Purchase not found"},
      {status:404}
    );
  }


  const entitlement = await prisma.entitlement.create({
    data:{
      userId: purchase.userId,
      gameId: purchase.gameId,
      source:"purchase",
    }
  });


  return Response.json(entitlement);

}