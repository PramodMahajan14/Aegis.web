// Lightweight, dependency-free input formatters (regex-based) used by the
// Advanced Form Elements page in place of jquery.inputmask.

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskPhone(value: string): string {
  const d = digitsOnly(value).slice(0, 10);
  const parts = [];
  if (d.length > 0) parts.push('(' + d.slice(0, 3));
  if (d.length >= 3) parts[0] += ')';
  if (d.length > 3) parts.push(' ' + d.slice(3, 6));
  if (d.length > 6) parts.push('-' + d.slice(6, 10));
  return parts.join('');
}

export function maskPhoneExt(value: string): string {
  const [base, ext = ''] = value.split('x');
  const phone = maskPhone(base);
  const extDigits = digitsOnly(ext).slice(0, 5);
  return extDigits ? phone + ' x' + extDigits : phone;
}

export function maskTaxId(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + '-' + d.slice(2);
}

export function maskSSN(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  let out = d.slice(0, 3);
  if (d.length > 3) out += '-' + d.slice(3, 5);
  if (d.length > 5) out += '-' + d.slice(5, 9);
  return out;
}

export function maskMoney(value: string): string {
  const d = value.replace(/[^\d.]/g, '');
  const num = parseFloat(d);
  if (Number.isNaN(num)) return '';
  return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function maskIPAddress(value: string): string {
  const octets = value
    .replace(/[^\d.]/g, '')
    .split('.')
    .slice(0, 4)
    .map((o) => o.slice(0, 3));
  return octets.join('.');
}

export function maskCreditCard(value: string): string {
  const d = digitsOnly(value).slice(0, 16);
  return d.match(/.{1,4}/g)?.join(' ') || d;
}

export function maskSerialKey(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
  return clean.match(/.{1,5}/g)?.join('-') || clean;
}
