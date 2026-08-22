
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    // --------------------------------------------------
    // 1. Get authorization header
    // --------------------------------------------------

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          error: "Missing token",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------
    // 2. Validate Bearer token
    // --------------------------------------------------

    if (!authHeader.startsWith("Bearer ")) {
      return Response.json(
        {
          error: "Invalid authorization header",
        },
        {
          status: 401,
        }
      );
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return Response.json(
        {
          error: "Missing token",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------
    // 3. Hash the launcher token
    // --------------------------------------------------

    const sessionHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // --------------------------------------------------
    // 4. Find launcher session
    // --------------------------------------------------

    const session = await prisma.launcherSession.findUnique({
      where: {
        sessionHash,
      },

      include: {
        user: true,
      },
    });

    if (!session) {
      return Response.json(
        {
          error: "Invalid session",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------
    // 5. Check session expiration
    // --------------------------------------------------

    if (session.expiresAt <= new Date()) {
      return Response.json(
        {
          error: "Session expired",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------
    // 6. Find active entitlements
    // --------------------------------------------------

    const entitlements = await prisma.entitlement.findMany({
      where: {
        userId: session.userId,

        OR: [
          {
            expiresAt: null,
          },

          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },

      include: {
        game: {
          include: {
            releases: {
              where: {
                published: true,
              },

              orderBy: {
                version: "desc",
              },
            },
          },
        },
      },
    });

    // --------------------------------------------------
    // 7. Convert entitlements into launcher games
    // --------------------------------------------------

    const games = entitlements
      .filter((item) => item.game)
      .map((item) => ({
        id: item.game.slug,

        title: item.game.title,

        owned: true,

        latestVersion:
          item.game.releases[0]?.version ?? null,
      }));

    // --------------------------------------------------
    // 8. Return library
    // --------------------------------------------------

    return Response.json({
      games,
    });
  } catch (error) {
    console.error("LAUNCHER LIBRARY ERROR:", error);

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

