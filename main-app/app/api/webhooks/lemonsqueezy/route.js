import { prisma } from "@/lib/prisma";
import { lemonPlans } from "@/lib/lemonPlans";

export async function POST(request){

  const body = await request.json();
  if(!body.data?.attributes?.variant_id){
  return Response.json({
    error:"Missing variant id"
  });
}
 const variantId = body.data?.attributes?.variant_id;

 const plan = lemonPlans[variantId];
 if(!plan){
  return Response.json({
    error:"Unknown plan"
  });
}

  console.log("PLAN:", plan);
  console.log("LEMON EVENT:", body);


  const event = body.meta?.event_name;


  if(event === "order_created"){

    const orderId = body.data.id;

const email = body.data.attributes.user_email;

const user = await prisma.user.findUnique({
  where:{
    email
  }
});


if(!user){
  return Response.json({
    error:"User not found"
  });
}


const userId = user.id;


const games = await prisma.game.findMany();
const gameId = games[0].id;


const existingPurchase = await prisma.purchase.findUnique({
  where:{
    externalId: orderId
  }
});


if(existingPurchase){
  return Response.json({
    message:"Purchase already processed"
  });
}


await prisma.purchase.create({
  data:{
    userId,
    gameId,
    provider:"lemonsqueezy",
    externalId:orderId,
    status:"active"
  }
});


let expiresAt = null;

if(plan.durationDays){
  expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + plan.durationDays
  );
}

for(const game of games){

  await prisma.entitlement.upsert({

  where:{
    userId_gameId:{
      userId,
      gameId:game.id
    }
  },

  update:{
    expiresAt,
    lifetime: plan.lifetime,
    verifiedAt:new Date()
  },

  create:{
    userId,
    gameId:game.id,
    source:"lemonsqueezy",
    expiresAt,
    lifetime:plan.lifetime
  }

});

}


    console.log("ACCESS GRANTED");
  }


  return Response.json({
    received:true
  });
}