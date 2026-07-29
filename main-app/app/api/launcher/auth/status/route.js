import { prisma } from "@/lib/prisma";


export async function GET(req) {

  try {

    const { searchParams } = new URL(req.url);

    const pollingId = searchParams.get("id");


    if (!pollingId) {

      return Response.json(
        {
          error:"Missing polling id"
        },
        {
          status:400
        }
      );

    }


    const loginRequest =
      await prisma.launcherLoginRequest.findUnique({

        where:{
          id:pollingId
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



    if (!loginRequest.completedAt) {

      return Response.json({

        completed:false

      });

    }



    return Response.json({

      completed:true,

      message:"Login complete"

    });



  } catch(error) {


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