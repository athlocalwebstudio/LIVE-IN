import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      pollingId,
      pollingSecret,
      itchUserId,
      itchUsername,
    } = body;

    if (!pollingId || !pollingSecret || !itchUserId) {
      return Response.json(
        {
          error: "Missing data",
        },
        {
          status: 400,
        }
      );
    }

    // Find the pending login request
    const loginRequest =
      await prisma.launcherLoginRequest.findUnique({
        where: {
          id: pollingId,
        },
      });

    if (!loginRequest) {
      return Response.json(
        {
          error: "Login request not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check expiration
    if (loginRequest.expiresAt <= new Date()) {
      return Response.json(
        {
          error: "Login request expired",
        },
        {
          status: 410,
        }
      );
    }

    // Prevent completing the same request twice
    if (loginRequest.completedAt) {
      return Response.json(
        {
          error: "Login request already completed",
        },
        {
          status: 409,
        }
      );
    }

    // Hash the supplied polling secret
    const pollingSecretHash = crypto
      .createHash("sha256")
      .update(pollingSecret)
      .digest("hex");

    // Verify the secret
    if (pollingSecretHash !== loginRequest.pollingSecretHash) {
      return Response.json(
        {
          error: "Invalid polling secret",
        },
        {
          status: 401,
        }
      );
    }

    // Create or find the user
    const user = await prisma.user.upsert({
      where: {
        itchUserId,
      },

      update: {
        itchUsername: itchUsername ?? null,
      },

      create: {
        itchUserId,
        itchUsername: itchUsername ?? null,
      },
    });

    // Create launcher session token
    const sessionToken =
      crypto.randomBytes(32).toString("hex");

    // Never store the raw token
    const sessionHash = crypto
      .createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    await prisma.launcherSession.create({
      data: {
        userId: user.id,
        sessionHash,

        expiresAt: new Date(
          Date.now() +
            30 * 24 * 60 * 60 * 1000
        ),
      },
    });

    // Mark login request as completed
    await prisma.launcherLoginRequest.update({
      where: {
        id: pollingId,
      },

      data: {
        completedAt: new Date(),
        sessionToken,
      },
    });

    return Response.json({
      success: true,

      user: {
        id: user.id,
        username: user.itchUsername,
      },

      sessionToken,
    });
  } catch (error) {
    console.error(
      "AUTH CALLBACK ERROR:",
      error
    );

    return Response.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}