export function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

export function generateKodeSS(nomorSS: number): string {
  return `SS-${padNumber(nomorSS)}`;
}

export function generateKodeSP(kodeSS: string, nomorSP: number): string {
  const ssSuffix = kodeSS.replace(/^SS-/, '');
  return `SP-${ssSuffix}.${padNumber(nomorSP)}`;
}

export function generateKodeSK(kodeSP: string, nomorSK: number): string {
  const spSuffix = kodeSP.replace(/^SP-/, '');
  return `SK-${spSuffix}.${padNumber(nomorSK)}`;
}

export function generateKodeIKU(kodeSK: string, nomorIKU: number): string {
  const skSuffix = kodeSK.replace(/^SK-/, '');
  return `IKU-${skSuffix}.${padNumber(nomorIKU)}`;
}

export function getStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  // PostgreSQL advisory lock uses positive or negative 32bit integer, or 64bit integer.
  // We return a positive number to be simple and safe.
  return Math.abs(hash);
}
