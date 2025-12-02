// Mock sendEmail
jest.mock("../utils/sendEmail", () => jest.fn().mockResolvedValue(true));
const sendEmail = require("../utils/sendEmail");

// Mock token utils
jest.mock("../utils/token", () => ({
  generateTemporaryToken: jest.fn(() => ({
    token: "mocked-token",
    hashedToken: "mocked-hashed-token",
  })),
  generateAccessToken: jest.fn(() => "mocked-access-token"),
  generateRefreshToken: jest.fn(() => "mocked-refresh-token"),

  generateHashedToken: jest.requireActual("../utils/token").generateHashedToken,
  verifyToken: jest.requireActual("../utils/token").verifyToken,
}));

// Require utilse
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const tokenUtils = require("../utils/token");

// Tests
describe("POST /api/auth/register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 when fields are missing", async () => {
    const email = `test${Date.now()}@example.com`;
    const res = await request(app).post("/api/auth/register").send({ email });

    expect(res.statusCode).toBe(400);

    if (res.body && Array.isArray(res.body.errors)) {
      expect(Array.isArray(res.body.errors)).toBe(true);

      const paths = res.body.errors
        .map((e) => e.path || e.param)
        .filter(Boolean);
      expect(paths).toEqual(expect.arrayContaining(["name", "password"]));

      const msgs = res.body.errors.map((e) => String(e.msg)).join(" ");
      expect(msgs.toLowerCase()).toMatch(/name/);
      expect(msgs.toLowerCase()).toMatch(/password/);
    } else {
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/All fields are required/);
    }
  });

  test("should return 400 when user already exists", async () => {
    await User.create({
      name: "Test",
      email: "exists@example.com",
      password: "password123!",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "exists@example.com",
      password: "password123!",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/User already exists/i);
  });

  test("should register user and send verification email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "newuser@example.com",
      password: "password123!",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("name", "Test");
    expect(res.body.data).toHaveProperty("email", "newuser@example.com");

    const user = await User.findOne({ email: "newuser@example.com" });
    expect(user).toBeTruthy();
    expect(user.emailVerificationToken).toBeDefined();
    expect(user.isVerified).toBe(false);

    expect(sendEmail).toHaveBeenCalled();
    const callArgs = sendEmail.mock.calls[0][0];
    expect(callArgs.to).toBe("newuser@example.com");
    expect(callArgs.subject).toMatch(/Email Verification|Verification|Verify/i);
  });
});
