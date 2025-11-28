import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
    it('renders the main content', () => {
        render(<Home />);
        // Check for a common element/text in your home page
        expect(screen.getByText(/to get started, edit the page\.tsx file\./i)).toBeInTheDocument();
    });
});
