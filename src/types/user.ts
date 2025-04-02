export type User = {
  firstName: string;
  email: string;
  lastName: string;
  rcNumber: string | null;
  phone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_nin_verified: boolean;
  is_bvn_verified: boolean;
  is_token_verified: boolean;
  company_id: string;
  id: number;
  referral_code: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

export type AuthUser = {
  token: string;
  login_expiry: number;
  expiresIn: string;
  refreshToken: string;
  refresh_expiry: number;
  refreshExpiresIn: string;
  isAuthenticated: boolean;
  user: User;
};
