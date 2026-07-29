import { prisma } from "@/lib/prisma";
import crypto from "crypto";


export async function POST(req) {
  try {

    const body = await req.json();

    const installationId = body.installationId;


    if (!installationId) {
      return Response.json(
        {
          error: "Missing installation id"
        },
        {
          status: 400
        }
      );
    }


    // Create random values

    const state = crypto.randomBytes(32).toString("hex");

    const pollingSecret = crypto.randomBytes(32).toString("hex");


    // Hash them before saving

    const stateHash = crypto
      .createHash("sha256")
      .update(state)
      .digest("hex");


    const pollingSecretHash = crypto
      .createHash("sha256")
      .update(pollingSecret)
      .digest("hex");
    const installationIdHash = crypto
      .createHash("sha256")
      .update(installationId)
      .digest("hex");  


const loginRequest = await prisma.launcherLoginRequest.create({
  data:{
    installationIdHash,
    stateHash,
    pollingSecretHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  }
});



    return Response.json({

      pollingId: loginRequest.id,

      pollingSecret,

      state,

      // temporary until itch OAuth exists
      authorizationUrl:
      "https://itch.io/login"

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