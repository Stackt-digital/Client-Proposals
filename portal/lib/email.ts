import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}
const FROM = "Stackt <portal@stackt.co.nz>";

export async function sendPortalWelcome({
  clientName,
  clientEmail,
  portalUrl,
}: {
  clientName: string;
  clientEmail: string;
  portalUrl: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `Your Stackt client portal is ready`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#121212">
        <img src="https://stackt.co.nz/logo.png" alt="Stackt" style="height:32px;margin-bottom:32px" />
        <h1 style="font-size:22px;font-weight:600;margin:0 0 8px">Hi ${clientName},</h1>
        <p style="color:#6e6e6e;margin:0 0 24px">Your Stackt client portal is now live. Use the link below to access your dashboard, review work, and stay across everything we're doing together.</p>
        <a href="${portalUrl}" style="display:inline-block;background:#0D2933;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Open your portal →</a>
        <p style="color:#999;font-size:12px;margin-top:32px">Bookmark this link — it's your permanent access point. No password needed.</p>
      </div>
    `,
  });
}

export async function sendActionItemNotification({
  clientName,
  clientEmail,
  portalUrl,
  actionTitle,
}: {
  clientName: string;
  clientEmail: string;
  portalUrl: string;
  actionTitle: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `Action required: ${actionTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#121212">
        <img src="https://stackt.co.nz/logo.png" alt="Stackt" style="height:32px;margin-bottom:32px" />
        <h1 style="font-size:22px;font-weight:600;margin:0 0 8px">Hi ${clientName},</h1>
        <p style="color:#6e6e6e;margin:0 0 8px">There's something that needs your attention:</p>
        <div style="background:#f5f7f8;border-radius:8px;padding:16px;margin-bottom:24px">
          <p style="margin:0;font-weight:600">${actionTitle}</p>
        </div>
        <a href="${portalUrl}" style="display:inline-block;background:#0D2933;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View in portal →</a>
      </div>
    `,
  });
}
