// server/middlewares/auth.js

// Authenticates protected requests using JWT bearer tokens.
// Attaches the authenticated user ID to the request.

import jwt from "jsonwebtoken";

// Validates the authorization header and JWT.
export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  // Reject requests without a bearer token.
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Expose the authenticated user ID to downstream handlers.
    req.userId = decoded.id;

    next();
  } catch {
    res.sendStatus(401);
  }
}
