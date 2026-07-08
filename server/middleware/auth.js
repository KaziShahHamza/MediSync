// server/middleware/auth.js
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, "secret");
    req.userId = decoded.id; // single source of truth
    next();
  } catch {
    res.sendStatus(401);
  }
}
