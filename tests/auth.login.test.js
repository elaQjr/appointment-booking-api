// Mock token utils
jest.mock('../utils/token', () => ({
    generateTemporaryToken: jest.fn(() => ({
        token: 'mocked-token',
        hashedToken: 'mocked-hashed-token'
    })),
    generateAccessToken: jest.fn(() => 'mocked-access-token'),
    generateRefreshToken: jest.fn(() => 'mocked-refresh-token'),
    generateHashedToken: jest.requireActual('../utils/token').generateHashedToken,
    verifyToken: jest.requireActual('../utils/token').verifyToken,
}));

// Require utilse
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const tokenUtils = require('../utils/token');

// Tests
describe('POST /api/auth/login', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 when email or password is missing', async () => {
        const email = `test${Date.now()}@example.com`
        const res =  await request(app)
            .post('/api/auth/login')
            .send( {email} );

        expect(res.statusCode).toBe(400);

        if (res.body && Array.isArray(res.body.errors)) {
            expect(Array.isArray(res.body.errors)).toBe(true);

            const paths = res.body.errors.map(e => e.path || e.param).filter(Boolean);
            expect(paths).toEqual(expect.arrayContaining(['password']));

            const msgs = res.body.errors.map(e => String(e.msg)).join(' ');
            expect(msgs).toMatch(/Email|Password/)
        } else {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Email and password are required/i);
        }
    });

    test('should return 401 when user does not exist', async () => {
        const email = `test${Date.now()}@example.com`
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email, password: 'password123!'});

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Invalid credentials/i);
    });

    test('should return 401 when password is incorrect', async () => {
        await User.create({
            name: 'Test',
            email: 'test@example.com',
            password: 'password123!',
            isVerified: true
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'wrongpass',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Invalid credentials/i);
    });

    test('should return 401 when email is not verified', async () => {
        await User.create({
            name: 'Test',
            email: 'test@example.com',
            password: 'password123!',
            isVerified: false
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123!',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Please verify your email first/i);
    });

    test('should login successfully and set tokens', async () => {
        await User.create({
            name: 'Test',
            email: 'test@example.com',
            password: 'password123!',
            isVerified: true  
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123!',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/Login successful/i);
        expect(res.body.data).toMatchObject({
            name: 'Test',
            email: 'test@example.com'
        });

        // accessToken
        expect(res.body).toHaveProperty('accessToken', 'mocked-access-token');

        // refreshToken
        const cookies = res.headers['set-cookie'];
        expect(Array.isArray(cookies)).toBe(true);
        const refreshCookie = cookies.find(c => /^refreshToken=/.test(c));
        expect(refreshCookie).toBeDefined();
        expect(refreshCookie).toEqual(expect.stringContaining('HttpOnly'));
        expect(refreshCookie).toEqual(expect.stringContaining('SameSite=Strict'));

        // Token functions are called
        expect(tokenUtils.generateAccessToken).toHaveBeenCalledTimes(1);
        expect(tokenUtils.generateRefreshToken).toHaveBeenCalledTimes(1);
        expect(tokenUtils.generateAccessToken).toHaveBeenCalledWith(expect.anything());
        expect(tokenUtils.generateRefreshToken).toHaveBeenCalledWith(expect.anything());
    });
});


