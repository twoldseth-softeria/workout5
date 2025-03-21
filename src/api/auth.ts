import { User } from '../types/auth';

const API_URL = '/api';

/**
 * Get the current user from the authentication token
 * @returns Promise containing the user information or throws an error
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/_me`);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Redirects the user to the login page
 */
export const redirectToLogin = () => {
  window.location.href = '/login';
};

/**
 * Logs the user out by redirecting to login page
 */
export const logout = () => {
  // In a real app, we might also need to invalidate the auth token
  redirectToLogin();
};