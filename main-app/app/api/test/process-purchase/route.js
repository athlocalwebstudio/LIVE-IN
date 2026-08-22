
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        externalId: "test-order-001",
      },
    });

    if (!purchase) {
      return Response.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    const entitlement = await prisma.entitlement.upsert({
      where: {
        userId_gameId: {
          userId: purchase.userId,
          gameId: purchase.gameId,
        },
      },
      update: {
        source: "purchase",
        verifiedAt: new Date(),
      },
      create: {
        userId: purchase.userId,
        gameId: purchase.gameId,
        source: "purchase",
      },
    });

    return Response.json(entitlement);
  } catch (error) {
    console.error("PROCESS PURCHASE ERROR:", error);

    return Response.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
