// server/middlewares/validate.js

// Provides reusable Zod validation middleware for Express routes.

export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      return next();
    }

    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    return res.status(400).json({
      message: errors[0]?.message || "Invalid request data.",
      errors,
    });
  };
}
