import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

/**
 * authenticateToken - required token middleware
 * Usage: import { authenticateToken } from "../middleware/auth.js";
 */
export const authenticateToken = (req, res, next) => {
  const header =
    (req.headers && (req.headers.authorization || req.headers.Authorization)) ||
    req.headers?.["x-access-token"] ||
    "";

  let token = null;
  if (typeof header === "string" && header.length) {
    const trimmed = header.trim();
    if (trimmed.toLowerCase().startsWith("bearer ")) token = trimmed.slice(7).trim();
    else token = trimmed;
  }

  if (!token) {
    req.user = null;
    req.userId = null;
    return res.status(401).json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    req.userId = payload?.id ?? payload?.userId ?? payload?.sub ?? null;
    return next();
  } catch (err) {
    req.user = null;
    req.userId = null;
    const message = err && err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(403).json({ success: false, error: message });
  }
};

/**
 * optionalAuth - attaches req.user / req.userId when token present; otherwise continues
 * Usage: import { optionalAuth } from "../middleware/auth.js";
 */
export const optionalAuth = (req, res, next) => {
  const header =
    (req.headers && (req.headers.authorization || req.headers.Authorization)) ||
    req.headers?.["x-access-token"] ||
    "";

  let token = null;
  if (typeof header === "string" && header.length) {
    const trimmed = header.trim();
    if (trimmed.toLowerCase().startsWith("bearer ")) token = trimmed.slice(7).trim();
    else token = trimmed;
  }

  if (!token) {
    req.user = null;
    req.userId = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    req.userId = payload?.id ?? payload?.userId ?? payload?.sub ?? null;
  } catch (err) {
    req.user = null;
    req.userId = null;
    if (process.env.NODE_ENV !== "production") console.warn("optionalAuth: invalid token:", err?.message ?? err);
  }
  return next();
};

// Default-compatible factory: auth(required = false)
export default function auth(required = false) {
  return required ? authenticateToken : optionalAuth;
}
