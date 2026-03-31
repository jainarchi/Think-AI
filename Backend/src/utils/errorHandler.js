/**
 * Custom API Error class
 * Used for throwing consistent errors throughout the application
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}


/**
 * Global error handling middleware
 * Catches all errors and returns a consistent response format
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];


  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate Entry";
    const field = Object.keys(err.keyValue)[0];
    errors = [
      {
        field: field,
        message: `${field} already exists`,
      },
    ];
  }


  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errors = [
      {
        field: "token",
        message: "Token is invalid or malformed",
      },
    ];
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errors = [
      {
        field: "token",
        message: "Token has expired",
      },
    ];
  }

  // Handle Mongoose Cast Error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    errors = [
      {
        field: err.path,
        message: `Invalid ${err.path}`,
      },
    ];
  }

  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: err.message,
      statusCode: statusCode,
      stack: err.stack,
    });
  }

  // Send error response
  return res.status(statusCode).json({
    message,
    success: false,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Async handler wrapper for controllers
 * Wraps controller functions to catch errors and pass them to error handler
 * Usage: router.get('/path', asyncHandler(controllerFunction))
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Try-catch wrapper for synchronous functions
 * Wraps synchronous functions to catch errors
 */
export const tryCatchWrapper = (fn) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };
};



export const createValidationError = (errors) => {
  return new ApiError(400, "Validation failed", errors);
};


export const createNotFoundError = (resource) => {
  return new ApiError(404, `${resource} not found`);
};

/**
 * Unauthorized error helper
 */
export const createUnauthorizedError = (message = "Unauthorized access") => {
  return new ApiError(401, message);
};

/**
 * Forbidden error helper
 */
export const createForbiddenError = (message = "Forbidden") => {
  return new ApiError(403, message);
};

/**
 * Conflict error helper
 */
export const createConflictError = (resource) => {
  return new ApiError(409, `${resource} already exists`);
};
