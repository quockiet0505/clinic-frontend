export const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Use VITE_API_BASE_URL but remove the /api/v1 suffix if it exists
  let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  baseUrl = baseUrl.replace(/\/api\/v1\/?$/, '');
  
  return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
};
