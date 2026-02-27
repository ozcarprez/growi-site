const SUPABASE_FUNCTIONS_URL = 'https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1';

export async function startCheckout({ email, company_name, phone }) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, company_name, phone }),
  });

  const data = await res.json();

  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Error al crear la sesión de pago');
  }

  window.location.href = data.url;
}

export async function checkSubscription(email) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/check-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return await res.json();
}
