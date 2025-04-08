export type User = {
  id: number;
  clientId: number;
  tierLevel: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  bvn: string;
  nin: string;
  alternateNumber: string;
  rcNumber: string;
  token: string;
  cbaWalletId: string;
  cbaFlexId: string;
  preferredNumber: string;
  email: string;
  referralCode: string;
  dateOfBirth: string;
  companyId: string;
  companyDomain: string;
  isActive: boolean;
  login2fa: boolean;
  is2fa: boolean;
  isPhoneVerified: boolean;
  isAlternateNumberVerified: boolean;
  isEmailVerified: boolean;
  isBvnVerified: boolean;
  isNinVerified: boolean;
  isDeactivated: boolean;
  acceptedTermsAndConditions: boolean;
  isUserPropagatedToCba: boolean;
  isTokenVerified: boolean;
  gender: string;
  userType: string;
  preferredNotificationChannel: "main_phone_number" | string;
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
};

export type AuthUser = {
  token: string;
  expiresIn?: string;
  refreshToken?: string;
  refreshExpiresIn?: string;
  isAuthenticated?: boolean;
  info?: User;
};
