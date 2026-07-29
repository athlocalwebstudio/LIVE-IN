import { prisma } from "@/lib/prisma";


export async function GET(req) {

  try {

    const authHeader = req.headers.get("authorization");


    if (!authHeader) {
      return Response.json(
        {
          error:"Missing token"
        },
        {
          status:401
        }
      );
    }


    const token =
      authHeader.replace("Bearer ","");


    const crypto = require("crypto");


    const sessionHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");



    const session =
      await prisma.launcherSession.findUnique({

        where:{
          sessionHash
        },

        include:{
          user:true
        }

      });



    if(!session){
      return Response.json(
        {
          error:"Invalid session"
        },
        {
          status:401
        }
      );
    }



    const entitlements =
      await prisma.entitlement.findMany({

        where:{
  userId:session.userId,

  OR:[
    {
      expiresAt:null
    },
    {
      expiresAt:{
        gt:new Date()
      }
    }
  ]
},

        include:{
          game:{
            include:{
              releases:{
                where:{
                  published:true
                }
              }
            }
          }
        }

      });



const games =
  entitlements
    .filter(item => item.game)
    .map((item) => ({
      id:item.game.slug,

      title:item.game.title,

      owned:true,

      latestVersion:
        item.game.releases[0]?.version ?? null
    }));


return Response.json({
  games
});


} catch(error){

  console.error(error);

  return Response.json(
    {
      error:"Server error"
    },
    {
      status:500
    }
  );

}

}