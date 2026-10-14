import { phoneHref } from "@/lib/phone";

type Props = {
  name: string;
  phone: string;
  date: string;
  venue: string;
};

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function notificationEmailText({ name, phone, date, venue }: Props): string {
  return [
    `New inquiry from dans-events.com`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Event date: ${date}`,
    `Venue: ${venue || "Not specified"}`,
    ``,
    `Call or text them back at ${phone}.`,
  ].join("\n");
}

export function notificationEmailHtml({ name, phone, date, venue }: Props): string {
  const tel = phoneHref(phone);
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;">
        <tr>
          <td style="background:#BC3021;padding:32px 40px;">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">
              New Inquiry
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 8px;">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Phone</span><br>
            <a href="tel:${tel}" style="font-size:28px;font-weight:700;color:#BC3021;text-decoration:none;">${esc(phone)}</a>
            <p style="margin:16px 0 0;">
              <a href="tel:${tel}" style="display:inline-block;background:#BC3021;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:12px 22px;margin-right:8px;">Call</a>
              <a href="sms:${tel}" style="display:inline-block;background:#3B3536;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:12px 22px;">Text</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #eee;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Name</span><br>
                  <span style="font-size:16px;font-weight:500;color:#3B3536;">${esc(name)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #eee;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Event Date</span><br>
                  <span style="font-size:16px;font-weight:500;color:#3B3536;">${esc(date)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Venue</span><br>
                  <span style="font-size:16px;font-weight:500;color:#3B3536;">${esc(venue || "Not specified")}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;background:#3B3536;">
            <span style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;">
              Dan's Events — Inquiry Form
            </span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
