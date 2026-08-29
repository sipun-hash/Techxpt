// API Configuration
// Supports Cloudflare Pages (VITE_API_URL), custom domain (api.noteground.in), and local XAMPP

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost/techxpt-api';
  }
  return 'https://api.noteground.in';
};

export const API_BASE_URL = getApiBase();

export const API_ENDPOINTS = {
  status: `${API_BASE_URL}/status.php`,
  contact: `${API_BASE_URL}/contact.php`,
  internship: `${API_BASE_URL}/internship.php`
};
