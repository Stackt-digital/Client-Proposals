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

export async function sendPendingActionsNotification({
  clientName,
  clientEmail,
  portalUrl,
  pendingItems,
}: {
  clientName: string;
  clientEmail: string;
  portalUrl: string;
  pendingItems: { title: string; description?: string }[];
}) {
  const resend = getResend();
  if (!resend) return;
  const itemsHtml = pendingItems
    .map(
      (item) => `
      <div style="border-left:3px solid #0D2933;padding:10px 14px;margin-bottom:10px;background:#f9fafb;border-radius:0 6px 6px 0">
        <p style="margin:0;font-weight:600;font-size:14px">${item.title}</p>
        ${item.description ? `<p style="margin:4px 0 0;font-size:13px;color:#6e6e6e">${item.description}</p>` : ""}
      </div>`
    )
    .join("");
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `You have ${pendingItems.length} action${pendingItems.length === 1 ? "" : "s"} waiting in your Stackt portal`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#121212">
        <img src="https://stackt.co.nz/logo.png" alt="Stackt" style="height:32px;margin-bottom:32px" />
        <h1 style="font-size:22px;font-weight:600;margin:0 0 8px">Hi ${clientName},</h1>
        <p style="color:#6e6e6e;margin:0 0 20px">Your Stackt team has flagged the following items that need your input:</p>
        ${itemsHtml}
        <a href="${portalUrl}" style="display:inline-block;background:#0D2933;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin-top:12px">Open your portal →</a>
        <p style="color:#999;font-size:12px;margin-top:32px">Questions? Just reply to this email.</p>
      </div>
    `,
  });
}

export async function sendActionCompletedToLead({
  clientName,
  accountLeadEmail,
  portalUrl,
  actionTitle,
}: {
  clientName: string;
  accountLeadEmail: string;
  portalUrl: string;
  actionTitle: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: accountLeadEmail,
    subject: `${clientName} completed an action item`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#121212">
        <img src="https://stackt.co.nz/logo.png" alt="Stackt" style="height:32px;margin-bottom:32px" />
        <h1 style="font-size:22px;font-weight:600;margin:0 0 8px">Action completed</h1>
        <p style="color:#6e6e6e;margin:0 0 8px"><strong>${clientName}</strong> has marked the following as done:</p>
        <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #bbf7d0">
          <p style="margin:0;font-weight:600">${actionTitle}</p>
        </div>
        <a href="${portalUrl}" style="display:inline-block;background:#0D2933;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View portal →</a>
      </div>
    `,
  });
}
