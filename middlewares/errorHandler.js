import { ApiError } from '../utils/ApiError.js';
import { errorLogger } from '../utils/winston.js';
import env from '../env.js'

export const errorHandler = (err, req, res, next) => {
  let error = err;
  //Handel Token Expiration error
  if(error.name==="TokenExpiredError"){
    error = new ApiError(error.statusCode||401, error.message, error?.errors || [], err.stack);
  }
  //Handel Error As Api Error
  if (!(error instanceof ApiError)) {
    const statusCode =error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }
  // Handle Prisma errors
  if (error.code && error.meta && error.meta.target) {
    const statusCode = error.code||500;
    const message = error.message || "Prisma error";
    error = new ApiError(statusCode, message, [], error.stack);
  }

  const response = {
    ...error,
    message: error.message,
    // Optionally include stack trace in development
    ...(env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  // Log the error
  if(env.NODE_ENV==="dev"){
    errorLogger.error(response);
  }

  return res.status(error.statusCode).send(response);
};
