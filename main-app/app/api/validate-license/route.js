export async function POST(req) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey || typeof licenseKey !== "string") {
      return Response.json(
        {
          valid: false,
          message: "Please enter a valid license key.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 🛠️ TEMPORARY BETA BYPASS (Add this section)
    // ==========================================
    const cleanKey = licenseKey.trim();
    
    // Add whatever temporary keys you want to hand out in your Discord here
    const betaBypassKeys = ["BETA-VIP-ACCESS", "STREAMER-NODE-2026", "DISCORD-BYPASS"]; 
    
    if (betaBypassKeys.includes(cleanKey)) {
      return Response.json({
        valid: true,
        message: "Beta override active. Welcome to Live In!",
      });
    }
    // ==========================================

    // Your original Lemon Squeezy fetch code stays completely untouched below:
    const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        license_key: cleanKey,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.valid) {
      return Response.json({
        valid: false,
        message: data.error || "This license key is invalid.",
      });
    }

    const expectedStoreId = process.env.LEMONSQUEEZY_STORE_ID;
    const expectedProductId = process.env.LEMONSQUEEZY_PRODUCT_ID;
    const expectedVariantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!expectedStoreId || !expectedProductId || !expectedVariantId) {
      return Response.json(
        {
          valid: false,
          message: "License validation is not configured yet.",
        },
        { status: 500 }
      );
    }

    const actualStoreId = String(data.meta?.store_id || "");
    const actualProductId = String(data.meta?.product_id || "");
    const actualVariantId = String(data.meta?.variant_id || "");

    const belongsToLiveIn =
      actualStoreId === String(expectedStoreId) &&
      actualProductId === String(expectedProductId) &&
      actualVariantId === String(expectedVariantId);

    if (!belongsToLiveIn) {
      return Response.json({
        valid: false,
        message: "This license key does not belong to Live In.",
      });
    }

    const status = data.license_key?.status;

    if (status === "expired" || status === "disabled") {
      return Response.json({
        valid: false,
        message: "This license is expired or disabled.",
      });
    }

    return Response.json({
      valid: true,
      message: "Your license is active. Downloads unlocked.",
    });
  } catch (error) {
    return Response.json(
      {
        valid: false,
        message: "Server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}