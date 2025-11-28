import { render, screen } from '@testing-library/react';
import Layout from '../app/layout';

jest.mock('../app/layout', () => {
    const ActualLayout = jest.requireActual('../app/layout');
    return {
        __esModule: true,
        ...ActualLayout,
        Geist: () => ({ variable: 'mock-font' }),
        Geist_Mono: () => ({ variable: 'mock-font-mono' }),
    };
});

// Mock Geist font import to prevent test errors
jest.mock('next/font/google', () => ({
    Geist: () => ({ variable: 'mock-font' }),
    Geist_Mono: () => ({ variable: 'mock-font-mono' }),
}));

describe('App Layout', () => {
    it('renders layout without crashing', () => {
        render(<Layout>{<div>Test Child</div>}</Layout>);
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
});
