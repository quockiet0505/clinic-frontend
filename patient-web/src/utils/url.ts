export const getStaticUrl = (): string => {
     return import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080';
   };