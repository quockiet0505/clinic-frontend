import React, { useEffect, useState } from 'react';
import { getStaticUrl } from '@/utils/url';
import { homeApi } from '@/features/home/api/homeApi';

export const Logo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('/images/logos/logo.png');
  const staticUrl = getStaticUrl();

  useEffect(() => {
    homeApi.getLogo()
      .then(url => setLogoUrl(url))
      .catch(() => console.error('Failed to load logo'));
  }, []);

  return <img src={`${staticUrl}${logoUrl}`} alt="Clinic Logo" className="h-10" />;
};