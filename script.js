const form = document.querySelector('#newsletter-form');
const msg = document.getElementById('message');
const emailInput = document.querySelector('#email');
const submitButton = document.querySelector('#submit-button');
const buttonLabel = document.querySelector('#button-label');
let isSubmitting = false;

function showMessage(text, type) {
  msg.textContent = text;
  msg.className = type;
  msg.setAttribute('role', type === 'error' ? 'alert' : 'status');
  msg.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
}

function clearMessage() {
  msg.textContent = '';
  msg.className = '';
  msg.setAttribute('role', 'status');
  msg.setAttribute('aria-live', 'polite');
  emailInput.removeAttribute('aria-invalid');
}

emailInput.addEventListener('input', () => {
  if (emailInput.hasAttribute('aria-invalid')) {
    clearMessage();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSubmitting) return;

  clearMessage();
  if (!form.checkValidity()) {
    emailInput.setAttribute('aria-invalid', 'true');
    showMessage('Please enter a valid email address.', 'error');
    emailInput.focus();
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;
  emailInput.readOnly = true;
  buttonLabel.textContent = 'Subscribing…';
  showMessage('Submitting your subscription…', 'status');

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim() })
    });

    if (!response.ok) {
      throw new Error(`Subscription failed (${response.status})`);
    }

    showMessage('Success! You have been subscribed.', 'success');
    emailInput.value = '';
  } catch (error) {
    showMessage('We could not complete your subscription. Please try again.', 'error');
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    emailInput.readOnly = false;
    buttonLabel.textContent = 'Subscribe';
  }
});
