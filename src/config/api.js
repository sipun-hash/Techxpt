// API Configuration
// When deploying to Cloudflare Pages, you can configure VITE_API_URL in Cloudflare Pages dashboard
// or update the default fallback URL below.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/techxpt-api';

export const API_ENDPOINTS = {
  contact: `${API_BASE_URL}/contact.php`,
  internship: `${API_BASE_URL}/internship.php`
};
