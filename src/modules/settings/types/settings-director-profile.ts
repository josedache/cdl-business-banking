export interface SettingsDirectorProfileFormikValues {
  bvn: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  userId: string;
  address: string;
  isPoliticallyExposed: boolean;
  ownsMoreThanFivePercent: boolean;
  sharePercentage: string;
}

export type Director = {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  sharePercentage: string;
  bvn: string;
  nin: string;
  is_director: string;
  date_of_birth: string;
  id: string;
  businessId: string;
  state: string;
  street?: string;
  lga: string;
  isPoliticallyExposed: boolean;
  ownsMoreThanFivePercent: boolean;
};
