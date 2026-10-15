import { Resend } from "resend";
import { notificationEmailHtml, notificationEmailText } from "@/lib/emails/notification";
import { normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

const TO_ADDRESS = "dantcacenco@gmail.com";
// dans-events.com is verified in Resend (DKIM + SPF), so Gmail trusts it; resend.dev is a shared test sender.
const FROM_ADDRESS = "Dan's Events Website <inquiries@dans-events.com>";
// Pages that send an `interest` (e.g. the 2027 package page); anything else is ignored.
const KNOWN_INTERESTS = new Set(["2027 Full Experience"]);

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY?.trim());
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const date = String(body.date ?? "").trim();
    const venue = String(body.venue ?? "").trim();
    const phone = normalizePhone(String(body.phone ?? ""));
    const interest = KNOWN_INTERESTS.has(String(body.interest)) ? String(body.interest) : "";

    if (!name || !date) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!phone) {
      return Response.json({ error: "Please enter a valid phone number" }, { status: 400 });
    }

    // The date input sends YYYY-MM-DD; parse it at noon UTC so it never shifts a day.
    const formattedDate = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      subject: `New Inquiry${interest ? ` (${interest})` : ""}: ${name} — ${formattedDate} — ${phone}`,
      html: notificationEmailHtml({ name, phone, date: formattedDate, venue, interest }),
      text: notificationEmailText({ name, phone, date: formattedDate, venue, interest }),
    });
    if (error) throw new Error(`Resend: ${error.message}`);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}
