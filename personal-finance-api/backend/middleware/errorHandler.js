export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const response = { message: err.message || "Internal server error" };

  if (err.name === "ValidationError") {
    response.message = "Validation failed";
    response.errors = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json(response);
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists." });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID." });
  }

  if (process.env.NODE_ENV !== "production") response.stack = err.stack;
  res.status(statusCode).json(response);
};
