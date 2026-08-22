
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { lemonPlans } from "@/lib/lemonPlans";

export async function POST(request) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const signature = request.headers.get("x-signature");

    if (!secret || !signature) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rawBody = await request.text();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const isValid =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

    if (!isValid) {
      return Response.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);

    const event = body.meta?.event_name;
    const attributes = body.data?.attributes;

    console.log("LEMON EVENT:", event);

    if (!attributes) {
      return Response.json(
        { error: "Missing attributes" },
        { status: 400 }
      );
    }

    const variantId = String(attributes.variant_id);
    const plan = lemonPlans[variantId];

    if (!plan) {
      return Response.json(
        { error: "Unknown plan" },
        { status: 400 }
      );
    }

    const email = attributes.user_email;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const games = await prisma.game.findMany();

    if (games.length === 0) {
      return Response.json(
        { error: "No games configured" },
        { status: 500 }
      );
    }

    /*
     * ONE-TIME PURCHASES
     */

    if (event === "order_created") {
      const orderId = body.data.id;

      const existingPurchase =
        await prisma.purchase.findUnique({
          where: {
            externalId: orderId
          }
        });

      if (!existingPurchase) {
        await prisma.purchase.create({
          data: {
            userId: user.id,
            gameId: games[0].id,
            provider: "lemonsqueezy",
            externalId: orderId,
            status: "active"
          }
        });
      }

      let expiresAt = null;

      if (plan.durationDays) {
        expiresAt = new Date();

        expiresAt.setDate(
          expiresAt.getDate() + plan.durationDays
        );
      }

      for (const game of games) {
        await prisma.entitlement.upsert({
          where: {
            userId_gameId: {
              userId: user.id,
              gameId: game.id
            }
          },

          update: {
            expiresAt,
            lifetime: plan.lifetime,
            source: "lemonsqueezy",
            verifiedAt: new Date()
          },

          create: {
            userId: user.id,
            gameId: game.id,
            source: "lemonsqueezy",
            expiresAt,
            lifetime: plan.lifetime
          }
        });
      }

      console.log("ONE-TIME ACCESS GRANTED");
    }

    /*
     * MONTHLY SUBSCRIPTION CREATED
     */

    if (event === "subscription_created") {
      const renewsAt = attributes.renews_at
        ? new Date(attributes.renews_at)
        : null;

      for (const game of games) {
        await prisma.entitlement.upsert({
          where: {
            userId_gameId: {
              userId: user.id,
              gameId: game.id
            }
          },

          update: {
            expiresAt: renewsAt,
            lifetime: false,
            source: "lemonsqueezy",
            verifiedAt: new Date()
          },

          create: {
            userId: user.id,
            gameId: game.id,
            source: "lemonsqueezy",
            expiresAt: renewsAt,
            lifetime: false
          }
        });
      }

      console.log("SUBSCRIPTION ACCESS GRANTED");
    }

    /*
     * MONTHLY PAYMENT SUCCESS / RENEWAL
     */

    if (event === "subscription_payment_success") {
      const renewsAt = attributes.renews_at
        ? new Date(attributes.renews_at)
        : null;

      for (const game of games) {
        await prisma.entitlement.upsert({
          where: {
            userId_gameId: {
              userId: user.id,
              gameId: game.id
            }
          },

          update: {
            expiresAt: renewsAt,
            lifetime: false,
            source: "lemonsqueezy",
            verifiedAt: new Date()
          },

          create: {
            userId: user.id,
            gameId: game.id,
            source: "lemonsqueezy",
            expiresAt: renewsAt,
            lifetime: false
          }
        });
      }

      console.log("SUBSCRIPTION RENEWED");
    }

    /*
     * SUBSCRIPTION CANCELLED
     *
     * IMPORTANT:
     * We do NOT immediately remove access.
     * The user keeps access until ends_at.
     */

    if (event === "subscription_cancelled") {
      const endsAt = attributes.ends_at
        ? new Date(attributes.ends_at)
        : null;

      for (const game of games) {
        await prisma.entitlement.updateMany({
          where: {
            userId: user.id,
            gameId: game.id
          },

          data: {
            expiresAt: endsAt,
            lifetime: false,
            source: "lemonsqueezy",
            verifiedAt: new Date()
          }
        });
      }

      console.log("SUBSCRIPTION CANCELLED — ACCESS KEPT UNTIL END");
    }

    /*
     * SUBSCRIPTION EXPIRED
     */

    if (event === "subscription_expired") {
      for (const game of games) {
        await prisma.entitlement.updateMany({
          where: {
            userId: user.id,
            gameId: game.id
          },

          data: {
            expiresAt: new Date(),
            lifetime: false,
            source: "lemonsqueezy",
            verifiedAt: new Date()
          }
        });
      }

      console.log("SUBSCRIPTION EXPIRED — ACCESS REMOVED");
    }

    return Response.json({
      received: true
    });

  } catch (error) {
    console.error("LEMON WEBHOOK ERROR:", error);

    return Response.json(
      {
        error: "Webhook processing failed"
      },
      {
        status: 500
      }
    );
  }
}
