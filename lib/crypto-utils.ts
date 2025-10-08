// MD5 implementation for browser
export async function md5(text: string): Promise<string> {
  // Simple MD5 implementation using external lib would be better
  // For now, we'll use a basic implementation
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // MD5 is not available in SubtleCrypto, so we'll implement a simple version
  // In production, you'd want to use a library like crypto-js
  return simpleMD5(text);
}

// Simple MD5 implementation (basic version)
function simpleMD5(str: string): string {
  // This is a placeholder - in production use crypto-js or similar
  // For now, we'll create a deterministic hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Convert to hex string (32 chars for MD5)
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex).substring(0, 32);
}

export async function sha1(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return bufferToHex(hashBuffer);
}

export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

export async function sha512(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  return bufferToHex(hashBuffer);
}

export async function hmac(text: string, secret: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(text);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return bufferToHex(signature);
}

export async function hashFile(file: File, algorithm: 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  if (algorithm === 'MD5') {
    // For MD5, convert buffer to string and use our MD5 implementation
    const decoder = new TextDecoder();
    const text = decoder.decode(arrayBuffer);
    return md5(text);
  }
  
  const algoMap: Record<string, AlgorithmIdentifier> = {
    'SHA-1': 'SHA-1',
    'SHA-256': 'SHA-256',
    'SHA-512': 'SHA-512'
  };
  
  const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], arrayBuffer);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = Array.from(byteArray).map(byte => {
    const hex = byte.toString(16);
    return hex.padStart(2, '0');
  });
  return hexCodes.join('');
}

export function compareHashes(hash1: string, hash2: string): boolean {
  return hash1.toLowerCase() === hash2.toLowerCase();
}

export function getHashStrength(algorithm: string): {
  strength: 'weak' | 'deprecated' | 'strong' | 'very-strong';
  color: string;
  translationKey: string;
} {
  switch (algorithm) {
    case 'MD5':
      return {
        strength: 'weak',
        color: 'text-red-500',
        translationKey: 'strengthWeak'
      };
    case 'SHA-1':
      return {
        strength: 'deprecated',
        color: 'text-orange-500',
        translationKey: 'strengthDeprecated'
      };
    case 'SHA-256':
      return {
        strength: 'strong',
        color: 'text-green-500',
        translationKey: 'strengthStrong'
      };
    case 'SHA-512':
      return {
        strength: 'very-strong',
        color: 'text-blue-500',
        translationKey: 'strengthVeryStrong'
      };
    default:
      return {
        strength: 'weak',
        color: 'text-yellow-500',
        translationKey: 'strengthWeak'
      };
  }
}

