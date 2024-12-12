import * as bcrypt from 'bcrypt';

export const generate_otp = (ln = 4) => {
  let otp = '';
  for (let i = 0; i < ln; i++) {
    otp += Math.round(Math.random() * 9);
  }
  return otp;
};

export const is_valid_string = (str: string): boolean => {
  if (typeof str !== 'string' || str === '') {
    return false;
  }
  return true;
};

export const is_valid_object = (obj: Record<string, any>): boolean => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

export const minutesDiff = (
  dateTimeValue2: Date,
  dateTimeValue1: Date,
): number => {
  let differenceValue =
    (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
};

export const hash_with_bcrypt = (plain_text: string): string => {
  const data = bcrypt.hashSync(plain_text, 10);
  return data;
};

export const compare_hash_with_bcrypt = (
  plain_text: string,
  hash: string,
): boolean => {
  return bcrypt.compareSync(plain_text, hash);
};
