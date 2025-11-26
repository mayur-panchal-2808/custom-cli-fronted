import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    console.log("=== CALLBACK STARTED ===");
    console.log("QUERY:", req.query);

    const { code, state } = req.query;

    console.log("STATE (should be CLI token):", state);

    if (!code) {
      console.log("Missing code!");
      return res.status(400).send("Missing code");
    }

    console.log(
      "Token URL:",
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`
    );

    const tokenResp = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          code,
          redirect_uri: process.env.AUTH0_CALLBACK,
        }),
      }
    );

    const tokenJson = await tokenResp.json();
    console.log("TOKEN RESPONSE:", tokenJson);

    if (tokenJson.error) {
      console.error("Auth0 token error:", tokenJson);
      return res.status(500).send("Auth0 token exchange failed");
    }

    console.log("Fetching user info...");

    const userInfoResp = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`,
        },
      }
    );

    const user = await userInfoResp.json();
    console.log("AUTH0 USER:", user);

    // DEBUG ENV VARS
    console.log("EXPRESS URL:", process.env.EXPRESS_STORE_SESSION_URL);
    console.log("SECRET:", process.env.NEXTJS_TO_EXPRESS_SECRET);

    // Notify Express
    const expressResp = await fetch(process.env.EXPRESS_STORE_SESSION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXTJS_TO_EXPRESS_SECRET}`,
      },
      body: JSON.stringify({
        token: state,
        user,
      }),
    });

    console.log("EXPRESS RESPONSE STATUS:", expressResp.status);
    console.log("EXPRESS RESPONSE:", await expressResp.text());

    res.send("Login complete, you can close this window.");
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    res.status(500).send("Server error");
  }
}
