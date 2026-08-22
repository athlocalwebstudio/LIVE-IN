import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const { userId, gameId } = body;

    if (!userId || !gameId) {
      return Response.json(
        {
          error: "Missing userId or gameId",
        },
        {
          status: 400,
        }
      );
    }

    const entitlement = await prisma.entitlement.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },

      update: {
        source: "developer-test",
        verifiedAt: new Date(),
        expiresAt: null,
        lifetime: true,
      },

      create: {
        userId,
        gameId,
        source: "developer-test",
        verifiedAt: new Date(),
        expiresAt: null,
        lifetime: true,
      },
    });

    return Response.json(entitlement);
  } catch (error) {
    console.error("CREATE ENTITLEMENT ERROR:", error);

    return Response.json(
      {
        error: "Failed to create entitlement",
      },
      {
        status: 500,
      }
    );
  }
}