import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const loginSuccess = (req, res, next) => {
  if (req.user) {
    res.redirect("http://localhost:5173");
  } else {
    throw new ApiError(500, "Login Failed");
  }
};

// Logout Handler
export const logout = (req, res, next) => {
  try {
    // If the user is authenticated via Google
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          throw new ApiError(500, "Google Logout Failed");
        }

        req.session.destroy((err) => {
          if (err) {
            throw new ApiError(500, "Google Logout Failed");
          }

          res.clearCookie("connect.sid", { path: "/" });
          return res
            .status(200)
            .json(new ApiResponse(200, null, "Logged out successfully (Google)"));
        });
      });
    }
  } catch (error) {
    next(new ApiError(500, error.message || "Logout Failed"));
  }
};


// Get User Info (Me)
export const getMe = (req, res, next) => {
  const user = req.user;
  
  res.status(200).json(new ApiResponse(200, {user}, "user get successfully"));
};