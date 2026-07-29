import { prisma } from "@/lib/prisma";
import crypto from "crypto";


export async function POST(req) {

  try {

    const body = await req.json();

    const { pollingId, pollingSecret } = body;


    if (!pollingId || !pollingSecret) {
      return Response.json(
        {
          error:"Missing data"
        },
        {
          status:400
        }
      );
    }


    const pollingSecretHash = crypto
      .createHash("sha256")
      .update(pollingSecret)
      .digest("hex");


    const loginRequest = await prisma.launcherLoginRequest.findUnique({
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


    if(loginRequest.pollingSecretHash !== pollingSecretHash){

      return Response.json(
        {
          error:"Invalid secret"
        },
        {
          status:403
        }
      );

    }


    if(!loginRequest.completedAt){

      return Response.json({
        completed:false
      });

    }


    return Response.json({
      completed:true,
      sessionToken: loginRequest.sessionToken
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