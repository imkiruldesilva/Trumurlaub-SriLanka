// ===================================================================
// TRAUMURLAUB LANKA – EMAIL SERVICE
// Dispatches notifications to:
// - nirosh19@yahoo.com
// - imkirul.desilva@gmail.com
// - traumurlaublanka.sl@gmail.com
// ===================================================================

const nodemailer = require('nodemailer');

const PRIMARY_RECIPIENT = process.env.EMAIL_PRIMARY || 'nirosh19@yahoo.com';
const SECONDARY_RECIPIENT = process.env.EMAIL_INQUIRY || 'imkirul.desilva@gmail.com';
const COMPANY_EMAIL = process.env.EMAIL_COMPANY || 'traumurlaublanka.sl@gmail.com';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass }
    });
  }
  return transporter;
}

async function sendInquiryEmail(inquiry) {
  const mailTransporter = getTransporter();

  const emailSubject = `🌴 New Travel Inquiry [${inquiry.id}] from ${inquiry.fullName} (${inquiry.country || 'Global'})`;
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #202820; background: #F5F7F1; padding: 20px; }
        .card { max-width: 650px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #D5DFD7; }
        .header { background: #123D2A; color: #FFFFFF; padding: 24px; text-align: center; }
        .content { padding: 28px; }
        .row { display: flex; padding: 8px 0; border-bottom: 1px solid #EEF2ED; }
        .label { width: 180px; font-weight: bold; color: #0B2419; }
        .value { flex-grow: 1; }
        .message-box { background: #F5F7F1; border-left: 4px solid #6FAF65; padding: 16px; margin-top: 16px; border-radius: 4px; }
        .footer { background: #0B2419; color: #BAC7BE; font-size: 12px; text-align: center; padding: 14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin: 0; color: #FFFFFF;">Traumurlaub Lanka</h2>
          <p style="margin: 4px 0 0; color: #6FAF65;">New Customer Travel Inquiry</p>
        </div>
        <div class="content">
          <div class="row"><div class="label">Inquiry Reference:</div><div class="value"><strong>${inquiry.id}</strong></div></div>
          <div class="row"><div class="label">Full Name:</div><div class="value">${inquiry.fullName}</div></div>
          <div class="row"><div class="label">Email:</div><div class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></div></div>
          <div class="row"><div class="label">Phone / WhatsApp:</div><div class="value"><a href="https://wa.me/${(inquiry.phone || '').replace(/[^0-9]/g, '')}">${inquiry.phone}</a></div></div>
          <div class="row"><div class="label">Country:</div><div class="value">${inquiry.country || 'Not specified'}</div></div>
          <div class="row"><div class="label">Travel Dates:</div><div class="value">${inquiry.arrivalDate || 'TBD'} to ${inquiry.departureDate || 'TBD'}</div></div>
          <div class="row"><div class="label">Travelers:</div><div class="value">${inquiry.adults || 1} Adults, ${inquiry.children || 0} Children</div></div>
          <div class="row"><div class="label">Preferred Tour:</div><div class="value">${inquiry.tourPackage || inquiry.excursion || 'Customized Sri Lanka Tour'}</div></div>
          <div class="row"><div class="label">Accommodation:</div><div class="value">${inquiry.accommodation || 'Flexible'}</div></div>
          <div class="row"><div class="label">Interests:</div><div class="value">${inquiry.travelInterests || 'None selected'}</div></div>
          <div class="row"><div class="label">Budget:</div><div class="value">${inquiry.budget || 'Not specified'}</div></div>
          
          <div class="message-box">
            <strong>Client Special Requirements:</strong>
            <p style="margin: 6px 0 0;">${inquiry.message ? inquiry.message.replace(/\n/g, '<br>') : 'No specific message.'}</p>
          </div>
        </div>
        <div class="footer">
          Traumurlaub Lanka Official Inquiries Notification System &copy; 2026
        </div>
      </div>
    </body>
    </html>
  `;

  if (mailTransporter) {
    try {
      const info = await mailTransporter.sendMail({
        from: `"Traumurlaub Lanka Inquiries" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: `${PRIMARY_RECIPIENT}, ${SECONDARY_RECIPIENT}`,
        cc: COMPANY_EMAIL,
        subject: emailSubject,
        html: emailHtml
      });
      console.log(`✓ Email notification dispatched for inquiry ${inquiry.id}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('SMTP Delivery error:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    // Development / unconfigured SMTP logging
    console.log(`[SMTP SIMULATOR] New Inquiry ${inquiry.id} logged. Would be dispatched to ${PRIMARY_RECIPIENT}, ${SECONDARY_RECIPIENT}, ${COMPANY_EMAIL}`);
    return { success: true, simulated: true };
  }
}

module.exports = {
  sendInquiryEmail
};
