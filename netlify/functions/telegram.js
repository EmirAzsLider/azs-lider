exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return { statusCode: 500, body: "TELEGRAM_BOT_TOKEN is not configured" };
  }

  try {
    const update = JSON.parse(event.body || "{}");
    const message = update.message;
    if (!message || !message.chat || !message.text) {
      return { statusCode: 200, body: "ok" };
    }

    const text = message.text.trim();
    if (!/^\/start(?:\s|$)/i.test(text)) {
      return { statusCode: 200, body: "ok" };
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: "👋 Добро пожаловать в АЗС «Лидер»!\n\nНажми кнопку ниже, чтобы открыть наше приложение: посмотреть цены на топливо, найти АЗС и построить маршрут.",
        reply_markup: {
          inline_keyboard: [[
            { text: "⛽ Открыть приложение АЗС «Лидер»", web_app: { url: "https://azs-lider.netlify.app" } }
          ]]
        }
      })
    });

    if (!response.ok) {
      return { statusCode: 502, body: "Telegram API error" };
    }
    return { statusCode: 200, body: "ok" };
  } catch (error) {
    return { statusCode: 400, body: "Invalid update" };
  }
};
