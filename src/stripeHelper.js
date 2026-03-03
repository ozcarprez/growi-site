const SUPABASE_FUNCTIONS_URL = 'https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1';

export async function startConnectionCheckout(requestData) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-connection-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });

  const data = await res.json();

  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Error al crear la sesión de pago');
  }

  window.location.href = data.url;
}
