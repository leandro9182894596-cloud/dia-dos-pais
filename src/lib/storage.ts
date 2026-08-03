export interface HomenagemFoto {
  id: string;
  src: string;
  caption: string;
  mensagem?: string;
}

export interface HomenagemData {
  id: string;
  createdAt: number; // timestamp ms
  clientName: string;
  partnerName: string;
  startDate: string; // ISO date string
  letterTitle?: string;
  letterBody: string;
  photos: HomenagemFoto[];
  musicUrl?: string;
}

const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function saveHomenagem(data: Omit<HomenagemData, "id" | "createdAt">): HomenagemData {
  const fullData: HomenagemData = {
    ...data,
    id: generateId(),
    createdAt: Date.now(),
  };

  try {
    localStorage.setItem(`homenagem_${fullData.id}`, JSON.stringify(fullData));
  } catch (err) {
    console.warn("localStorage space limit, saving essential metadata:", err);
  }

  return fullData;
}

export function getHomenagem(id: string): { data: HomenagemData | null; isExpired: boolean; remainingMs: number } {
  // First check localStorage
  const raw = localStorage.getItem(`homenagem_${id}`);
  let data: HomenagemData | null = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  // If not found in localStorage, attempt decoding from payload if id is a compressed payload
  if (!data) {
    data = decodeHomenagemPayload(id);
  }

  if (!data) {
    return { data: null, isExpired: true, remainingMs: 0 };
  }

  const elapsed = Date.now() - data.createdAt;
  const remainingMs = Math.max(0, EXPIRATION_MS - elapsed);
  const isExpired = elapsed >= EXPIRATION_MS;

  return { data, isExpired, remainingMs };
}

export function isHomenagemExpired(createdAt: number): boolean {
  return Date.now() - createdAt >= EXPIRATION_MS;
}

export function getTimeRemainingParts(remainingMs: number) {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

/**
 * Encodes homage data into a URL-safe Base64 payload so it can be shared via URL hash/query
 * even across different browsers or devices without a database!
 */
export function encodeHomenagemPayload(data: HomenagemData): string {
  try {
    const json = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch {
    return data.id;
  }
}

export function decodeHomenagemPayload(encodedPayload: string): HomenagemData | null {
  try {
    const decoded = decodeURIComponent(atob(encodedPayload));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Resizes and compresses uploaded photo using HTML Canvas
 * to ensure fast rendering and lightweight storage.
 */
export function compressImage(file: File, maxWidth = 900, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Erro ao carregar a imagem."));
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
