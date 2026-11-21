exports.handler = async (event) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const setupKey = process.env.TELEGRAM_SETUP_KEY;
  const suppliedKey = event.queryStringParameters && event.queryStringParameters.key;

  if (!token || !setupKey) {
    return { statusCode: 500, body: "Set TELEGRAM_BOT_TOKEN and TELEGRAM_SETUP_KEY in Netlify environment variables." };
  }
  if (!suppliedKey || suppliedKey !== setupKey) {
    return { statusCode: 403, body: "Forbidden" };
  }

  try {
    const webhookUrl = "https://azs-lider.netlify.app/.netlify/functions/telegram";
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl, allowed_updates: ["message"] })
    });
    const result = await response.json();
    return {
      statusCode: response.ok ? 200 : 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return { statusCode: 500, body: "Could not configure Telegram webhook." };
  }
};
