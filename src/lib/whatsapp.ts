export type WhatsAppPayload = {
  name: string;
  company: string;
  service: string;
};

export function createWhatsAppMessage({ name, company, service }: WhatsAppPayload) {
  return `Olá, meu nome é ${name} e sou responsável pela marca ${company}. Estou buscando ${service} e gostaria de conversar sobre o projeto.`;
}

export function createWhatsAppUrl(phone: string, payload: WhatsAppPayload) {
  const message = encodeURIComponent(createWhatsAppMessage(payload));
  const sanitizedPhone = phone.replace(/\D/g, "");

  return sanitizedPhone
    ? `https://wa.me/${sanitizedPhone}?text=${message}`
    : `https://api.whatsapp.com/send?text=${message}`;
}
