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
}>;

export type MerchantRegistrationCacApiRequest = ApiRequest<
  void,
  void,
  {
    rcNumber: string;
    id?: string;
  }
>;

export type GetMerchantBusinessDataApiResponse = ApiResponse<
  {
    name: string;
    key: string;
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
