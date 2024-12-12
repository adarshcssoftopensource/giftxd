import * as speakeasy from 'speakeasy';
export async function verifyTwoFAComan(model) {
  try {
    const valid = speakeasy.totp.verify({
      secret: model.twofaSecret,
      encoding: 'base32',
      token: model.appSecret,
    });
    if (valid) {
      return true;
    }

    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
