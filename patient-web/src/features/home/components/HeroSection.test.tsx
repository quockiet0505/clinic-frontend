import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from './HeroSection'; // Ensure this matches your component export

describe('HeroSection Component', () => {
  it('renders successfully', () => {
    // Wrap in BrowserRouter in case the Hero component contains <Link> or hooks from react-router
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    
    // Add assertions based on your HeroSection content
    // expect(screen.getByText(/Đặt lịch khám/i)).toBeInTheDocument();
  });
});
