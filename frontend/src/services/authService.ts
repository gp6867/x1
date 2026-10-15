import api from "./api";

// ========== AUTHENTICATION ==========
export const loginUser = (data: any) =>
  api.post("/auth/login", data);

export const registerUser = (data: any) =>
  api.post("/auth/register", data);

// ========== GOOGLE AUTH ==========
export const googleAuth = (token: string) =>
  api.post("/auth/google", { token });

// ========== FORGOT PASSWORD FLOW ==========
export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const verifyOTP = (email: string, otp: string) =>
  api.post("/auth/verify-otp", { email, otp });

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  api.post("/auth/reset-password", { 
    email, 
    otp, 
    new_password: newPassword 
  });

// ========== USER PROFILE ==========
export const getUserProfile = () =>
  api.get("/user/profile");

export const updateUserProfile = (data: any) =>
  api.put("/user/profile", data);

export const changePassword = (data: any) =>
  api.post("/user/change-password", data);

// ========== LOGOUT ==========
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return api.post("/auth/logout");
};
