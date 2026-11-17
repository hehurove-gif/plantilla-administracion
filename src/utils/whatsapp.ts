/** Enlace de WhatsApp con mensaje prellenado. Devuelve null si el número está vacío o no es válido. */
export function whatsappLink(numero: string, mensaje = ''): string | null {
  const digitos = numero.replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(digitos)) return null;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}
