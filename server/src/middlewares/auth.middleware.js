import { ApiError } from "../utils/ApiError.js";
export const isAuthenticated = async (req, res, next) => {
  try {
    // Check if the user is authenticated via Google
    if (req.user && req.isAuthenticated()) {
      return next();
    }
  } catch (error) {
    return next(new ApiError(401, error?.message || "Unauthorized request"));
  }
};

export const protectAdmin = (req, res, next) => {
  if (!req.session || !req.session.admin) {
    throw new ApiError(401, "Not authorized, please log in as admin");
  }
  next();
};

export const isAuthenticatedOrAdmin = async (req, res, next) => {
  try {
    if (req.user && req.isAuthenticated()) {
      return next();
    }
    
    if (req.session && req.session.admin) {
      return next();
    }

    throw new ApiError(401, "Not authorized, please log in");
  } catch (error) {
    next(new ApiError(401, error?.message || "Unauthorized request"));
  }
};
