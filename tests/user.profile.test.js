// Mock token utils
jest.mock('../utils/token', () => {
    const actual = jest.requireActual('../utils/token');
    return {
        ...actual,
        generateAccessToken: jest.fn(() => 'mocked-access-token'),
        generateRefreshToken: jest.fn(() => 'mocked-refresh-token'),
        verifyToken: jest.fn(),
    };
});

// Require utilse
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const tokenUtils = require('../utils/token');

// Tests
describe('GET /api/users/me', () => {
    let user;
    let accessToken;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test',
            email: `test${Date.now()}@example.com`,
            password: 'password123!',
            isVerified: true
        });

        tokenUtils.verifyToken.mockImplementation(() => ({
            valid: true,
            expired: false,
            decoded: { id: user._id.toString() },
        }));

        accessToken = tokenUtils.generateAccessToken(user._id.toString());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 200 and user profile when token is valid', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/Token is valid/i);
        expect(res.body.data).toHaveProperty('name', user.name);
        expect(res.body.data).toHaveProperty('email', user.email);
    });

    test('should return 401 when token is missing', async () => {
        const res = await request(app).get('/api/users/me');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/توکن ارائه نشده!/i);
    });

    test('should return 401 when token is invalid', async () => {
        tokenUtils.verifyToken.mockImplementation(() => ({
            valid: false,
            expired: false,
            decoded: null,
            message: "توکن نامعتبره",
        }));

        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', 'Bearer invalid-token');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("توکن نامعتبره");
    });

    test('should return 401 when token is expired', async () => {
        tokenUtils.verifyToken.mockImplementation(() => ({
            valid: false,
            expired: true,
            decoded: null,
            message: "توکن منقضی شده",
        }));

        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("توکن منقضی شده!");
    });
});
