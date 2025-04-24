import { ApiRequest, ApiResponse } from "./api";

export type BankLookupApiRequest = ApiRequest<
  void,
  void,
  { bankName?: string; activeOnly: boolean }
>;

export type BankLookupApiResponse = ApiResponse<
  Array<{
    id: number;
    createdby_id: number;
    created_date: string;
    lastmodifiedby_id: number;
    lastmodified_date: string;
    name: string;
    slug: string | null;
    code: string;
    active: number;
    bank_sort_code: string;
    nip_code: string;
    bank_type_id: number;
    external_bank_id: number;
    icon: string;
  }>
>;

export type sectorsLookupApiResponse = ApiResponse<
  Array<{
    name: string;
    cba_id: number;
    is_active: boolean;
    description?: string;
  }>
>;

export type SubSectorsLookupApiRequest = ApiRequest<
  void,
  { sectorId?: number }
>;

export type SubSectorsLookupApiResponse = ApiResponse<
  Array<{
    name: string;
    cba_id: number;
    is_active: boolean;
    business_sector_id: number;
  }>
>;
