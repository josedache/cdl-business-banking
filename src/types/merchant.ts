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
