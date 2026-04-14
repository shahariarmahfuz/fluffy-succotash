export default {
  async email(message, env, ctx) {
    try {
      const rawEmail = await new Response(message.raw).text();

      const headersObj = {};
      for (const [key, value] of message.headers) {
        headersObj[key] = value;
      }

      const payload = {
        from: message.from,
        to: message.to,
        size: message.rawSize,
        headers: headersObj,
        raw_email: rawEmail
      };

      const response = await fetch("https://mail.softrise.app/webhook/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Backend rejected the request with status: ${response.status}`);
      }

      console.log(`Successfully forwarded email from ${message.from} to backend.`);
    } catch (error) {
      console.error("Failed to process or forward email:", error.message);
    }
  }
};
