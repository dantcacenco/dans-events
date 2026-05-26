type Props = {
  name: string;
  date: string;
  venue: string;
};

export function confirmationEmailHtml({ name, date, venue }: Props): string {
  const firstName = name.split(" ")[0];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

        <!-- HEADER — Black bar with logo text -->
        <tr>
          <td style="background:#000000;padding:32px 40px;">
            <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">
              Dan's events
            </span>
          </td>
        </tr>

        <!-- RED ACCENT BAR -->
        <tr>
          <td style="background:#BC3021;height:6px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- MAIN CONTENT -->
        <tr>
          <td style="padding:48px 40px 32px;">
            <h1 style="margin:0 0 8px;font-size:32px;font-weight:900;text-transform:uppercase;color:#000000;letter-spacing:-1px;line-height:1.1;">
              We got<br>your date.
            </h1>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="width:40px;height:4px;background:#BC3021;"></td>
                <td></td>
              </tr>
            </table>
            <p style="margin:0 0 24px;font-size:16px;font-weight:300;line-height:1.7;color:#444;">
              ${firstName}, thanks for reaching out. I personally review every inquiry and I'll get back to you within 24 hours.
            </p>
          </td>
        </tr>

        <!-- DETAILS CARD — Modular grid inspired -->
        <tr>
          <td style="padding:0 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;">
              <tr>
                <td style="padding:32px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.1);">
                        <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.4);">
                          Your Details
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#BC3021;">Name</span><br>
                        <span style="font-size:16px;font-weight:500;color:#ffffff;line-height:2;">${name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#BC3021;">Event Date</span><br>
                        <span style="font-size:16px;font-weight:500;color:#ffffff;line-height:2;">${date}</span>
                      </td>
                    </tr>
                    ${venue ? `
                    <tr>
                      <td style="padding:16px 0;">
                        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#BC3021;">Venue</span><br>
                        <span style="font-size:16px;font-weight:500;color:#ffffff;line-height:2;">${venue}</span>
                      </td>
                    </tr>` : ""}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RED SQUARE ACCENT + MESSAGE -->
        <tr>
          <td style="padding:0 40px 48px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:24px;height:24px;background:#BC3021;vertical-align:top;"></td>
                <td style="padding-left:16px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.7;color:#666;">
                    In the meantime, start thinking about the feeling you want your guests to walk away with. Not the playlist — the <em>feeling</em>. That's where we'll start.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#000000;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:14px;font-weight:700;color:#ffffff;letter-spacing:1px;">Dan's events</span><br>
                  <span style="font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:3px;text-transform:uppercase;">
                    Hosting Your Always &amp; Forever
                  </span>
                </td>
                <td align="right" style="vertical-align:top;">
                  <span style="font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:1px;">
                    Wedding DJ &amp; MC<br>Asheville, NC
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
