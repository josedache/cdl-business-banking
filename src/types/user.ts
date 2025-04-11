export type User = {
  id: number;
  clientId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string;
  bvn: string;
  nin: string;
  rcNumber: string | null;
  email: string;
  referralCode: string | null;
  dateOfBirth: string;
  companyId: string;
  companyDomain: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  isAlternateNumberVerified: boolean;
  isEmailVerified: boolean;
  isBvnVerified: boolean;
  isNinVerified: boolean;
  isDeactivated: boolean;
  acceptedTermsAndConditions: boolean;
  isTokenVerified: boolean;
  gender: string | null;
  userType: string | null;
  preferredNotificationChannel: string;
  businesses: Array<{
    id: string;
    is_validated: boolean;
    name: string;
  }>;
  transactionPin: Array<{
    id: string;
    is_active: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  token: string;
  expiresIn?: string;
  refreshToken?: string;
  refreshExpiresIn?: string;
  isAuthenticated?: boolean;
  info?: User;
};
