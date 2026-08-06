export const getStaticUrl = (): string => {
  return import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080';
};

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = getStaticUrl();
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};