import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const pollingId = searchParams.get("id");
    const pollingSecret = searchParams.get("pollingSecret");

    if (!pollingId || !pollingSecret) {
      return Response.json(
        {
          error: "Missing polling id or polling secret",
        },
        {
          status: 400,
        }
      );
    }

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

    // Hash the supplied polling secret
    const pollingSecretHash = crypto
      .createHash("sha256")
      .update(pollingSecret)
      .digest("hex");

    // Compare against stored hash
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

    // Login has not been completed yet
    if (!loginRequest.completedAt) {
      return Response.json({
        completed: false,
      });
    }

    // Login completed
    return Response.json({
      completed: true,
      message: "Login complete",
    });

  } catch (error) {
    console.error("AUTH STATUS ERROR:", error);

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