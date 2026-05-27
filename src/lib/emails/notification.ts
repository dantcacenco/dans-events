type Props = {
  name: string;
  email: string;
  date: string;
  venue: string;
};

export function notificationEmailHtml({ name, email, date, venue }: Props): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td style="background:#BC3021;padding:32px 40px;">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">
              New Inquiry
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #eee;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Name</span><br>
                  <span style="font-size:16px;font-weight:500;color:#3B3536;">${name}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #eee;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Email</span><br>
                  <a href="mailto:${email}" style="font-size:16px;font-weight:500;color:#BC3021;text-decoration:none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #eee;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Event Date</span><br>
                  <span style="font-size:16px;font-weight:500;color:#3B3536;">${date}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;">
                  <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Venue</span><br>
                  <span style="font-size:16px;font-weight:500;color:#3B3536;">${venue || "Not specified"}</span>
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
