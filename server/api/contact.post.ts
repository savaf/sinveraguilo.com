interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const CONTACT_TO = "hello@sinveraguilo.com";
const CONTACT_FROM = "Sinver Aguiló Portfolio <contact@sinveraguilo.com>";

export default defineEventHandler(async (event) => {
  const { name, email, subject, message } = await readBody<ContactBody>(event);

  if (!name || !email || !subject || !message) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email address" });
  }

  const { resendApiKey } = useRuntimeConfig(event);
  if (!resendApiKey) {
    throw createError({ statusCode: 500, statusMessage: "Email delivery is not configured" });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `[Portfolio] ${subject} — ${name}`,
      text: `${message}\n\n—\n${name}\n${email}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw createError({ statusCode: 502, statusMessage: "Failed to send message", data: detail });
  }

  return { ok: true };
});
