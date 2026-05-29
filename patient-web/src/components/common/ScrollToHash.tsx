// src/components/common/ScrollToHash.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
   
    if (location.hash && location.hash !== '#') {
    
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);

      if (element) {
        // Delay nhỏ để đảm bảo DOM đã render xong
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]); // Chạy mỗi khi location thay đổi

  return null; // Component này không render gì
};