import { beforeEach, describe, expect, it, vi } from "vitest";

const g = globalThis as any;
let key: string | undefined;
let body: any;
g.defineEventHandler = (fn: unknown) => fn;
g.readBody = async () => body;
g.createError = (o: any) => Object.assign(new Error(o.statusMessage), o);
g.useRuntimeConfig = () => ({ resendApiKey: key });

async function call() {
  const handler = (await import("../server/api/contact.post")).default as any;
  return handler({});
}
const valid = { name: "Ana", email: "ana@example.com", subject: "Hi", message: "Hello there" };

beforeEach(() => { key = "test-key"; body = { ...valid }; g.fetch = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}), text: async () => "" })); });

describe("POST /api/contact", () => {
  it.each(["name", "email", "subject", "message"])("400 when %s is missing", async (f) => {
    delete body[f];
    await expect(call()).rejects.toMatchObject({ statusCode: 400 });
    expect(g.fetch).not.toHaveBeenCalled();
  });
  it.each(["nope", "a@b", "a b@c.de", "@c.de"])("400 on invalid email %s", async (email) => {
    body.email = email;
    await expect(call()).rejects.toMatchObject({ statusCode: 400 });
  });
  it("500 when the email provider is not configured", async () => {
    key = undefined;
    await expect(call()).rejects.toMatchObject({ statusCode: 500 });
  });
  it("sends one email with reply_to set to the visitor", async () => {
    await call();
    expect(g.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = g.fetch.mock.calls[0];
    expect(url).toContain("resend.com");
    const sent = JSON.parse(init.body);
    expect(sent.reply_to).toBe(valid.email);
    expect(sent.subject).toContain("Hi");
    expect(init.headers.Authorization).toBe("Bearer test-key");
  });
});
