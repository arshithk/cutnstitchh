import nodemailer from "nodemailer";
import { env } from "./env";

export interface QuoteEmailData {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  message: string;
}

export async function sendQuoteNotificationEmail(data: QuoteEmailData): Promise<{ sent: boolean; reason?: string }> {
  const recipientEmail = env.SITE_CONTACT_EMAIL || "vidhyashankar@cutnstitchapparel.com";
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;

  // Clean phone number for WhatsApp link
  const phoneDigits = data.phone.replace(/\D/g, "");
  const waLink = phoneDigits.length >= 10 
    ? `https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}?text=${encodeURIComponent(`Hi ${data.name}, thank you for your inquiry with Cut N Stitch Apparel regarding ${data.product}.`)}`
    : null;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0d10; color: #f3f4f6; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #13171f; border-radius: 16px; border: 1px solid #2d3748; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1a202c, #0f131a); padding: 32px 28px; border-bottom: 2px solid #b89c72; text-align: center; }
          .brand { font-size: 24px; font-weight: 800; letter-spacing: 3px; color: #ffffff; text-transform: uppercase; margin: 0; }
          .brand span { color: #b89c72; }
          .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; margin-top: 6px; }
          .badge { display: inline-block; background: rgba(184, 156, 114, 0.15); border: 1px solid rgba(184, 156, 114, 0.35); color: #d4af37; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 16px; }
          .content { padding: 32px 28px; }
          .title { font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 20px; }
          .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .grid td { padding: 12px 14px; border-bottom: 1px solid #1f2937; font-size: 14px; }
          .grid td.label { width: 38%; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
          .grid td.value { color: #f9fafb; font-weight: 600; }
          .message-box { background: #0c0e12; border-left: 3px solid #b89c72; padding: 16px; border-radius: 8px; margin-bottom: 28px; }
          .message-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 6px; }
          .message-text { color: #e5e7eb; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; }
          .actions { text-align: center; padding-top: 10px; margin-bottom: 20px; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; margin: 6px 4px; }
          .btn-primary { background: #b89c72; color: #000000; }
          .btn-whatsapp { background: #25d366; color: #ffffff; }
          .btn-secondary { background: #1f2937; color: #ffffff; border: 1px solid #374151; }
          .footer { background: #0c0e12; padding: 20px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #1f2937; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">CUT N <span>STITCH</span></h1>
            <div class="tagline">apparel.com &bull; B2B Manufacturing Desk</div>
            <div class="badge">New Manufacturing Inquiry</div>
          </div>
          <div class="content">
            <p class="title">A new customer inquiry has been received from cutnstitchapparel.com:</p>
            <table class="grid">
              <tr>
                <td class="label">Client Name</td>
                <td class="value">${data.name}</td>
              </tr>
              <tr>
                <td class="label">Company / Brand</td>
                <td class="value">${data.company || "N/A"}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value"><a href="mailto:${data.email}" style="color: #60a5fa; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone / Mobile</td>
                <td class="value"><a href="tel:${data.phone}" style="color: #60a5fa; text-decoration: none;">${data.phone}</a></td>
              </tr>
              <tr>
                <td class="label">Garment Category</td>
                <td class="value" style="color: #d4af37;">${data.product}</td>
              </tr>
              <tr>
                <td class="label">Target Quantity</td>
                <td class="value">${data.quantity.toLocaleString()} pieces</td>
              </tr>
            </table>

            <div class="message-box">
              <div class="message-title">Production Requirements & Notes:</div>
              <p class="message-text">${data.message || "No additional message provided."}</p>
            </div>

            <div class="actions">
              <a href="mailto:${data.email}?subject=${encodeURIComponent(`Cut N Stitch Apparel Quote - ${data.product}`)}" class="btn btn-primary">✉️ Reply to ${data.name}</a>
              ${waLink ? `<a href="${waLink}" class="btn btn-whatsapp" target="_blank">💬 WhatsApp Client</a>` : ""}
              <a href="tel:${data.phone}" class="btn btn-secondary">📞 Call Client</a>
            </div>
          </div>
          <div class="footer">
            Automated lead notification for Vidhyashankar &bull; Cut N Stitch Apparel &bull; Tirupur, India
          </div>
        </div>
      </body>
    </html>
  `;

  // If SMTP is not configured, log clearly and return fallback indication
  if (!user || !pass) {
    console.log(`[Mailer] SMTP credentials not set (SMTP_USER/SMTP_PASS). Email formatted for ${recipientEmail}.`);
    return { sent: false, reason: "SMTP credentials not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || "smtp.gmail.com",
      port: env.SMTP_PORT || 465,
      secure: env.SMTP_SECURE,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: env.SMTP_FROM || `"Cut N Stitch Inquiry" <${user}>`,
      to: recipientEmail,
      replyTo: data.email,
      subject: `✨ New Inquiry: ${data.company || data.name} - ${data.product} (${data.quantity} pcs)`,
      text: `New Manufacturing Inquiry for Cut N Stitch Apparel:\n\nClient: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nPhone: ${data.phone}\nProduct: ${data.product}\nQuantity: ${data.quantity} pcs\n\nRequirements:\n${data.message || "N/A"}`,
      html: htmlContent,
    });

    console.log(`[Mailer] Successfully dispatched inquiry email to ${recipientEmail}`);
    return { sent: true };
  } catch (error) {
    console.error("[Mailer] Failed to send email via SMTP:", error);
    return { sent: false, reason: (error as Error).message };
  }
}
