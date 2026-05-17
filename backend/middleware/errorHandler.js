const errorHandler = (err, req, res, _next) => {
  console.error(`Error: ${err.message}`);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      messages,
    });
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      success: false,
      error: "Resource not found",
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists`,
    });
  }

  // Default to 500 internal server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
