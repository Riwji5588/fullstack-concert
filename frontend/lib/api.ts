// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  concerts: {
    base: `${API_URL}/concerts`,
    history: `${API_URL}/concerts/history`,
  },
  user: {
    submitEventConcert: (id: number, type: string) => `${API_URL}/user/${id}/${type}`,
} 
};

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
