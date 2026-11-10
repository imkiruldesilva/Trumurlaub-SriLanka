/* ===================================================================
   TRAUMURLAUB LANKA – WHATSAPP INTEGRATION
   Official Number: +94 777 978 768 / 94777978768
   =================================================================== */

const WHATSAPP_PHONE = '94777978768';

function getWhatsAppUrl(customMessage) {
  const defaultMsg = 'Hello Traumurlaub Lanka! I would like to inquire about your Sri Lanka tour packages.';
  const msg = customMessage || defaultMsg;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

function openWhatsAppChat(message) {
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function formatInquiryForWhatsApp(formData) {
  let msg = `*Traumurlaub Lanka - New Travel Inquiry*\n`;
  msg += `------------------------------\n`;
  msg += `*Name:* ${formData.fullName || ''}\n`;
  msg += `*Email:* ${formData.email || ''}\n`;
  msg += `*Phone / WhatsApp:* ${formData.phone || ''}\n`;
  msg += `*Country:* ${formData.country || ''}\n`;
  if (formData.arrivalDate) msg += `*Arrival Date:* ${formData.arrivalDate}\n`;
  if (formData.departureDate) msg += `*Departure Date:* ${formData.departureDate}\n`;
  if (formData.adults) msg += `*Adults:* ${formData.adults} | *Children:* ${formData.children || 0}\n`;
  if (formData.tourPackage) msg += `*Preferred Tour:* ${formData.tourPackage}\n`;
  if (formData.excursion) msg += `*Preferred Excursion:* ${formData.excursion}\n`;
  if (formData.accommodation) msg += `*Accommodation:* ${formData.accommodation}\n`;
  if (formData.budget) msg += `*Budget:* ${formData.budget}\n`;
  if (formData.message) msg += `\n*Message / Notes:*\n${formData.message}\n`;
  msg += `------------------------------\n`;
  msg += `Sent via Traumurlaub Lanka Online Portal`;
  return msg;
}

// Bind quick WhatsApp buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wa-tour]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tourName = btn.getAttribute('data-wa-tour');
      const msg = `Hello Traumurlaub Lanka! I am interested in inquiring about the "${tourName}" package. Please provide details and pricing.`;
      openWhatsAppChat(msg);
    });
  });

  document.querySelectorAll('[data-wa-excursion]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const excName = btn.getAttribute('data-wa-excursion');
      const msg = `Hello Traumurlaub Lanka! I am inquiring about the "${excName}" one-day excursion. Please share details.`;
      openWhatsAppChat(msg);
    });
  });
});
