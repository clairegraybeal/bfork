import { Review } from '@/types';

const STORAGE_KEY = 'bitchfork_reviews';
const USERNAME_KEY = 'bitchfork_username';

export function getReviews(): Review[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveReview(review: Review): void {
  const reviews = getReviews();
  reviews.unshift(review); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function deleteReview(id: string): void {
  const reviews = getReviews().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function getUsername(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USERNAME_KEY) || '';
}

export function setUsername(name: string): void {
  localStorage.setItem(USERNAME_KEY, name);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

