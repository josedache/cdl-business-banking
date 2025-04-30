import { ApiRequest, ApiResponse } from "./api";

export type MerchantRegistrationNonCacApiResponse = ApiResponse<unknown>;

export type MerchantRegistrationNonCacApiRequest = ApiRequest<{
  businessType: string;
  businessName: string;
  annualTurnOver: string;
  businessSector: string;
}>;

export type MerchantRegistrationCacApiResponse = ApiResponse<{
  expiry: number;
  phone: string;
  email?: string;
}>;

export type MerchantRegistrationCacApiRequest = ApiRequest<
  {
    rcNumber: string;
    businessType: number;
    registrationType?: number;
    businessSubSector: number;
    businessSector: number;
    annualTurnOver: number;
  },
  void
>;

export type GetMerchantBusinessDataApiResponse = ApiResponse<
  {
    name: string;
    key: string;
    cba_id: string;
    subcategories?: string[];
  }[]
>;

export type GetMerchantBusinessDataApiRequest = ApiRequest<
  void,
  void,
  {
    search?: string;
    details_type:
      | "Business_Type"
      | "Business_Sector"
      | "Business_Registration_Type";
  }
>;

export type MerchantBusinessProfileApiResponse = ApiResponse<{
  business: {
    name: string;
    rcNumber: string;
    active: boolean;
    kybTier: string;
    businessType: string;
    officeName: string;
    id: number;
    registrationType: string;
  };
}>;

export type MerchantBusinessProfileApiRequest = ApiRequest<void>;

export type MerchantBusinessDirectorsApiResponse = ApiResponse<
  [
    {
      firstName: string;
      lastName: string;
      phone?: string;
      avatar?: string;
    },
  ]
>;

export type MerchantBusinessDirectorsApiRequest = ApiRequest<void>;

export type MerchantAddressStatesApiResponse = ApiResponse<unknown>;

export type MerchantAddressStatesApiRequest = ApiRequest<{
  address: string;
  street: string;
  nearestLandmark: string;
  city: string;
  state: string;
  lga: string;
  postalCode: string;
}>;

export type GetMerchantAddressApiRequest = ApiRequest<{ rcNumber: string }>;

export type GetMerchantAddressApiResponse = ApiResponse<{
  street: string;
  nearestLandMark: string;
  address: string;
  state_id: string;
  city: string;
  lga_id: string;
  lga_name: string;
  state_name: string;
  country_id: number;
  country_name: string;
  postalCode: string;
}>;

export type GetMerchantMemorandumApiRequest = ApiRequest<unknown>;
export type GetMerchantMemorandumApiResponse = ApiResponse<
  [
    {
      id: number;
      parentEntityType: string;
      parentEntityId: number;
      name: string;
      fileName: string;
      size: number;
      type: string;
      location: string;
      description: string;
    },
  ]
>;
