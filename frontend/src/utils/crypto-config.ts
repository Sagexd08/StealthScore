/**
 * Crypto Configuration for CSP Compliance
 * Configures crypto libraries to avoid eval() usage and ensure Content Security Policy compliance
 */

// Import crypto libraries with CSP-safe configurations
import CryptoJS from 'crypto-js';

// Configure CryptoJS to avoid eval usage
const cryptoConfig = {
  // Use static algorithms instead of dynamic evaluation
  algorithm: 'AES',
  mode: CryptoJS.mode.GCM,
  padding: CryptoJS.pad.NoPadding,
  // Disable any dynamic code execution
  format: CryptoJS.format.Hex
};

// CSP-compliant AES encryption
export const encryptData = (data: string, key: string): string => {
  try {
    // Use static encryption without eval
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

// CSP-compliant AES decryption
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    // Use static decryption without eval
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

// CSP-compliant hash generation
export const generateHash = (data: string, algorithm: 'SHA256' | 'SHA512' = 'SHA256'): string => {
  try {
    switch (algorithm) {
      case 'SHA256':
        return CryptoJS.SHA256(data).toString();
      case 'SHA512':
        return CryptoJS.SHA512(data).toString();
      default:
        return CryptoJS.SHA256(data).toString();
    }
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Hash generation failed');
  }
};

// CSP-compliant random key generation
export const generateRandomKey = (length: number = 32): string => {
  try {
    // Use crypto-safe random generation without eval
    const randomWords = CryptoJS.lib.WordArray.random(length);
    return randomWords.toString();
  } catch (error) {
    console.error('Key generation error:', error);
    throw new Error('Key generation failed');
  }
};

// CSP-compliant HMAC generation
export const generateHMAC = (data: string, key: string, algorithm: 'SHA256' | 'SHA512' = 'SHA256'): string => {
  try {
    switch (algorithm) {
      case 'SHA256':
        return CryptoJS.HmacSHA256(data, key).toString();
      case 'SHA512':
        return CryptoJS.HmacSHA512(data, key).toString();
      default:
        return CryptoJS.HmacSHA256(data, key).toString();
    }
  } catch (error) {
    console.error('HMAC generation error:', error);
    throw new Error('HMAC generation failed');
  }
};

// CSP-compliant base64 encoding/decoding
export const encodeBase64 = (data: string): string => {
  try {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
  } catch (error) {
    console.error('Base64 encoding error:', error);
    throw new Error('Base64 encoding failed');
  }
};

export const decodeBase64 = (encodedData: string): string => {
  try {
    return CryptoJS.enc.Base64.parse(encodedData).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Base64 decoding error:', error);
    throw new Error('Base64 decoding failed');
  }
};

// CSP-compliant password-based key derivation
export const deriveKey = (password: string, salt: string, iterations: number = 10000): string => {
  try {
    // Use PBKDF2 without eval
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: iterations,
      hasher: CryptoJS.algo.SHA256
    });
    return key.toString();
  } catch (error) {
    console.error('Key derivation error:', error);
    throw new Error('Key derivation failed');
  }
};

// CSP-compliant secure random salt generation
export const generateSalt = (length: number = 16): string => {
  try {
    const salt = CryptoJS.lib.WordArray.random(length);
    return salt.toString();
  } catch (error) {
    console.error('Salt generation error:', error);
    throw new Error('Salt generation failed');
  }
};

// Secure data validation
export const validateEncryptedData = (data: string): boolean => {
  try {
    // Basic validation without eval
    return typeof data === 'string' && data.length > 0 && /^[A-Za-z0-9+/=]+$/.test(data);
  } catch (error) {
    console.error('Data validation error:', error);
    return false;
  }
};

// Export crypto utilities
export const CryptoUtils = {
  encrypt: encryptData,
  decrypt: decryptData,
  hash: generateHash,
  generateKey: generateRandomKey,
  hmac: generateHMAC,
  encodeBase64,
  decodeBase64,
  deriveKey,
  generateSalt,
  validate: validateEncryptedData
};

// Export configured CryptoJS
export { CryptoJS };
export default CryptoUtils;
