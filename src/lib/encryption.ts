import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'sua-chave-secreta';

export const encryptText = (text: string): string => {
  try {
    if (!text) return '';
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return '';
  }
};

export const decryptText = (encryptedText: string): string => {
  try {
    if (!encryptedText) return '';
    
    // Verifica se o texto já está descriptografado
    // (útil durante a transição para o sistema criptografado)
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        // Se não conseguiu descriptografar, retorna o texto original
        return encryptedText;
      }
      
      return decrypted;
    } catch {
      // Se der erro na descriptografia, provavelmente o texto não está criptografado
      return encryptedText;
    }
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return encryptedText;
  }
}; 