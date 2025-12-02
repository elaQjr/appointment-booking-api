// Mock token utils
jest.mock("../utils/token", () => {
  const actual = jest.requireActual("../utils/token");
  return {
    ...actual,
    generateAccessToken: jest.fn(() => "mocked-access-token"),
    generateRefreshToken: jest.fn(() => "mocked-refresh-token"),
    verifyToken: jest.fn(),
  };
});

// Require utilse
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const tokenUtils = require("../utils/token");

// Tests
describe("GET /api/auth/refresh", () => {
  let user;
  let refreshToken;

  beforeEach(async () => {
    user = await User.create({
      name: "Test",
      email: `test${Date.now()}@example.com`,
      password: "password123!",
      isVerified: true,
    });

    tokenUtils.verifyToken.mockImplementation(() => ({
      valid: true,
      expired: false,
      decoded: { id: user._id.toString() },
    }));

    refreshToken = tokenUtils.generateRefreshToken(user._id.toString());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 401 when refresh token is missing", async () => {
    const res = await request(app).get("/api/auth/refresh");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(
      /Access Denied. No refresh token provided./i
    );
  });

  test("should return 401 when refresh token is invalid", async () => {
    tokenUtils.verifyToken.mockImplementation(() => ({
      valid: false,
      expired: false,
      decoded: null,
    }));

    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", ["refreshToken=invalid-refresh-token"]);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid refresh token/i);
  });

  test("should return 401 when refresh token is expired", async () => {
    tokenUtils.verifyToken.mockImplementation(() => ({
      valid: false,
      expired: true,
      decoded: null,
    }));

    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid refresh token/i);
  });

  test("should return 401 when user no longer exists", async () => {
    await User.deleteMany();

    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/User not found/i);
  });

  test("should return 200 and new access token when refresh token is valid", async () => {
    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("accessToken", "mocked-access-token");
    expect(tokenUtils.generateAccessToken).toHaveBeenCalledWith(
      user._id.toString()
    );
    expect(tokenUtils.generateRefreshToken).toHaveBeenCalledWith(
      user._id.toString()
    );
  });
});
