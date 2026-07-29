import { prisma } from "@/lib/prisma";

export async function POST(){

 const entitlement = await prisma.entitlement.create({
   data:{
     userId:"cms56wtml000fwouilxb869od",
     gameId:"cms57f4vi000hwouinm4qqwvb",
     source:"developer-test",
     verifiedAt:new Date()
   }
 });

 return Response.json(entitlement);

}