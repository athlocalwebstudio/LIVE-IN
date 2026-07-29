import { prisma } from "@/lib/prisma";
import crypto from "crypto";


export async function GET(req) {

  try {

    const authHeader = req.headers.get("authorization");


    if (!authHeader) {
      return Response.json(
        {
          error: "Missing authorization"
        },
        {
          status:401
        }
      );
    }


    const token = authHeader.replace("Bearer ", "");


    if (!token) {
      return Response.json(
        {
          error:"Missing token"
        },
        {
          status:401
        }
      );
    }



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



    if (!session) {

      return Response.json(
        {
          error:"Invalid session"
        },
        {
          status:401
        }
      );

    }



    if (session.expiresAt < new Date()) {

      return Response.json(
        {
          error:"Session expired"
        },
        {
          status:401
        }
      );

    }



    return Response.json({

      authenticated:true,

      user:{
        id:session.user.id,
        username:session.user.itchUsername
      }

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