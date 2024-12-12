const Crypto = async () => {
  return await import('node:crypto');
};

const ENCRYPTION_KEY = 'aJbnNm/8eIQMj4YishqVuL/MYhBZub4w';

export const encryptData = async (data: string) => {
  const crypto = await Crypto();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

export const decryptData = async ({
  encryptedData,
  iv,
}: {
  encryptedData: string;
  iv: string;
}) => {
  const crypto = await Crypto();
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted += decipher.final('utf-8') as any;
  return decrypted;
};

export function obfuscateEmail(email) {
  const [username, domain] = email.split('@');
  const obfuscatedUsername =
    username.charAt(0) +
    '*'.repeat(username.length - 2) +
    username.charAt(username.length - 1);
  const [domainName, topLevelDomain] = domain.split('.');
  const obfuscatedDomain =
    domainName.charAt(0) +
    '*'.repeat(domainName.length - 1) +
    '.' +
    topLevelDomain;
  return `${obfuscatedUsername.charAt(0)}*${obfuscatedUsername.slice(
    1,
  )}@${obfuscatedDomain}`;
}

export function maskPhoneNumber(phoneNumber: string): string {
  const visibleDigits = 4;
  const maskedDigits = phoneNumber
    .slice(-visibleDigits)
    .padStart(phoneNumber.length, '*');
  return maskedDigits;
}
