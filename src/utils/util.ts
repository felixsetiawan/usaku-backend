/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

import CryptoJs, { AES } from 'crypto-js';

import { getAuth } from 'firebase-admin/auth';

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return [year, month, day].join('-');
};

export const decrypt = (data: string, key = 'arief selalu jago'): string => {
  return AES.decrypt(data, key).toString(CryptoJs.enc.Utf8);
};

export const verifyToken = async (token: string): Promise<string | void> => {
  return await getAuth()
    .verifyIdToken(token)
    .then(decodedToken => {
      return decodedToken.uid;
    })
    .catch(error => {
      console.error(error);
    });
};
