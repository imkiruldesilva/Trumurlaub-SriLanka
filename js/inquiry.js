/* ===================================================================
   TRAUMURLAUB LANKA – INQUIRY SYSTEM
   - Handles Travel Inquiries & Tour Customizations
   - Form Validation, Backend Persistence, SMTP Dispatch
   - Dynamic Pre-Filling from URL Parameters (?tour=..., ?excursion=...)
   - Instant WhatsApp Forwarding Integration
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initInquiryForm();
});

function initInquiryForm() {
  const form = document.getElementById('travel-inquiry-form');
  if (!form) return;

  prefillFromUrl(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const feedback = document.getElementById('inquiry-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Basic Validation
    const fullName = form.querySelector('[name="fullName"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();

    if (!fullName || !email || !phone) {
      showFeedback(feedback, 'Please fill in all required fields (Name, Email, and Phone/WhatsApp).', 'error');
      return;
    }

    const formData = {
      fullName: fullName,
      email: email,
      phone: phone,
      country: form.querySelector('[name="country"]')?.value.trim() || '',
      arrivalDate: form.querySelector('[name="arrivalDate"]')?.value || '',
      departureDate: form.querySelector('[name="departureDate"]')?.value || '',
      adults: parseInt(form.querySelector('[name="adults"]')?.value, 10) || 1,
      children: parseInt(form.querySelector('[name="children"]')?.value, 10) || 0,
      tourPackage: form.querySelector('[name="tourPackage"]')?.value || '',
      excursion: form.querySelector('[name="excursion"]')?.value || '',
      accommodation: form.querySelector('[name="accommodation"]')?.value || '',
      travelInterests: getSelectedCheckboxes(form, 'travelInterests'),
      budget: form.querySelector('[name="budget"]')?.value.trim() || '',
      message: form.querySelector('[name="message"]')?.value.trim() || ''
    };

    // UI state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Your Inquiry...';

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        let successHtml = `<strong>Ayubowan & Thank you, ${escapeHtml(formData.fullName)}!</strong><br>` +
          `Your inquiry (Ref: <code>${result.inquiryId || 'TL-' + Date.now().toString().slice(-6)}</code>) has been received successfully.<br>` +
          `Our founder Nirosh will review your travel requirements and contact you within a few hours.`;

        // Add WhatsApp quick button
        const waMsg = formatInquiryForWhatsApp(formData);
        const waUrl = getWhatsAppUrl(waMsg);
        successHtml += `<div style="margin-top: 14px;"><a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm"><i class="fa-brands fa-whatsapp"></i> Send Instantly to WhatsApp (+94 777 978 768)</a></div>`;

        showFeedback(feedback, successHtml, 'success');
        form.reset();
      } else {
        throw new Error(result.message || 'Server error processing inquiry');
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      // Even if backend is not yet started or offline, generate WhatsApp inquiry so visitor never loses their message!
      const waMsg = formatInquiryForWhatsApp(formData);
      const waUrl = getWhatsAppUrl(waMsg);
      const fallbackHtml = `Your inquiry has been prepared! For immediate personalized booking assistance, click below to send it directly to our founder Nirosh on WhatsApp:<br>` +
        `<div style="margin-top: 14px;"><a href="${waUrl}" target="_blank" class="btn btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Send via WhatsApp to +94 777 978 768</a></div>`;
      showFeedback(feedback, fallbackHtml, 'success');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

function prefillFromUrl(form) {
  const params = new URLSearchParams(window.location.search);
  const tour = params.get('tour');
  const excursion = params.get('excursion');

  if (tour) {
    const tourSelect = form.querySelector('[name="tourPackage"]');
    if (tourSelect) {
      for (let option of tourSelect.options) {
        if (option.value.toLowerCase().includes(tour.toLowerCase()) || option.text.toLowerCase().includes(tour.toLowerCase())) {
          tourSelect.value = option.value;
          break;
        }
      }
    }
  }

  if (excursion) {
    const excSelect = form.querySelector('[name="excursion"]');
    if (excSelect) {
      for (let option of excSelect.options) {
        if (option.value.toLowerCase().includes(excursion.toLowerCase()) || option.text.toLowerCase().includes(excursion.toLowerCase())) {
          excSelect.value = option.value;
          break;
        }
      }
    }
  }
}

function getSelectedCheckboxes(form, name) {
  const checkboxes = form.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value).join(', ');
}

function showFeedback(el, message, type) {
  if (!el) return;
  el.className = `form-feedback ${type}`;
  el.innerHTML = message;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
