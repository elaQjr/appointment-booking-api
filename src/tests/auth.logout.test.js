// Require utilse
const request = require('supertest');
const app = require('../app');

// Tests
describe('POST /api/auth/logout', () => {
    test('should clear refreshToken cookie and return 200', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', 'refreshToken=some-refresh-token');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/Logout was successful/i);

        const cookies = res.headers['set-cookie'];
        expect(Array.isArray(cookies)).toBe(true);
        const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
        expect(refreshCookie).toBeDefined();
        expect(refreshCookie).toMatch(/refreshToken=;/);
        expect(refreshCookie).toMatch(/Expires=/);
    });
});