import handler from "../pages/api/auth/callback";
jest.mock('node-fetch', () => jest.fn());

describe('API Auth Callback', () => {
    it('should be a function', () => {
        expect(typeof handler).toBe('function');
    });
});
