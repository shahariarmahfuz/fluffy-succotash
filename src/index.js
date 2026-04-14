export default {
  async email(message, env, ctx) {
    try {
      // ১. ইমেইলের সম্পূর্ণ Raw ডেটা (EML) রিড করা
      const rawEmail = await new Response(message.raw).text();

      // ২. ইমেইলের সকল হেডার (Headers) একটি JSON অবজেক্টে রূপান্তর করা
      const headersObj = {};
      for (const [key, value] of message.headers) {
        headersObj[key] = value;
      }

      // ৩. ব্যাকএন্ডে পাঠানোর জন্য সম্পূর্ণ পে-লোড (Payload) তৈরি
      const payload = {
        from: message.from,
        to: message.to,
        size: message.rawSize, // মেইলের সাইজ
        headers: headersObj,   // সাবজেক্ট, ডেট ইত্যাদি সব হেডার
        raw_email: rawEmail    // সম্পূর্ণ অরিজিনাল মেইল
      };

      // ৪. আপনার FastAPI ব্যাকএন্ডে ডেটা পাঠানো (Webhook)
      const response = await fetch("https://mail.softrise.app/webhook/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // সরাসরি হার্ডকোড করা সিক্রেট টোকেন
          "Authorization": "Bearer my_super_secret_token_123" 
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
