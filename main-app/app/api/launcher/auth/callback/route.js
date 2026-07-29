import { prisma } from "@/lib/prisma";
import crypto from "crypto";


export async function POST(req) {

  try {

    const body = await req.json();

    const {
      pollingId,
      itchUserId,
      itchUsername
    } = body;


    if (!pollingId || !itchUserId) {
      return Response.json(
        {
          error: "Missing data"
        },
        {
          status:400
        }
      );
    }


    // Find the pending launcher login request

    const loginRequest =
      await prisma.launcherLoginRequest.findUnique({
        where:{
          id: pollingId
        }
      });


    if (!loginRequest) {
      return Response.json(
        {
          error:"Login request not found"
        },
        {
          status:404
        }
      );
    }



    // Create or find the user

    const user =
      await prisma.user.upsert({

        where:{
          itchUserId
        },

        update:{
          itchUsername
        },

        create:{
          itchUserId,
          itchUsername
        }

      });



    // Create launcher session token

    const sessionToken =
      crypto.randomBytes(32).toString("hex");



    const sessionHash =
      crypto
        .createHash("sha256")
        .update(sessionToken)
        .digest("hex");



    await prisma.launcherSession.create({

      data:{

        userId:user.id,

        sessionHash,

        expiresAt:
          new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          )

      }

    });

    await prisma.launcherLoginRequest.update({
  where:{
    id: pollingId
  },
  data:{
    completedAt: new Date()
  }
});



    return Response.json({

      success:true,

      user:{
        id:user.id,
        username:user.itchUsername
      },

      sessionToken

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