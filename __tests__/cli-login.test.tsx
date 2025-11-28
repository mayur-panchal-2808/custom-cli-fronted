import { render, screen } from '@testing-library/react';
import React from 'react';
import Login from '../pages/cli/login';

describe('CLI Login Page', () => {
    it('renders login page', () => {
        render(<Login />);
        // Check for the actual text rendered by the component
        expect(screen.getByText(/redirecting to auth0/i)).toBeInTheDocument();
    });
});
