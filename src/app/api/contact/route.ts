import { Resend } from "resend";
import { notificationEmailHtml } from "@/lib/emails/notification";
import { confirmationEmailHtml } from "@/lib/emails/confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, venue } = body;

    if (!name || !email || !date) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Dan's Events <onboarding@resend.dev>";

    await Promise.all([
      resend.emails.send({
        from: fromAddress,
        to: "dantcacenco@gmail.com",
        subject: `New Inquiry: ${name} — ${formattedDate}`,
        html: notificationEmailHtml({ name, email, date: formattedDate, venue }),
      }),
      resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "We got your date — Dan's Events",
        html: confirmationEmailHtml({ name, date: formattedDate, venue }),
      }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
