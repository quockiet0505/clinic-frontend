import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroSection } from './HeroSection';

describe('HeroSection Component', () => {
  it('renders successfully', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
  });
});
