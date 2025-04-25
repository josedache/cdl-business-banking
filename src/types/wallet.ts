import { ApiRequest, ApiResponse } from "./api";

export type GetWalletsApiRequest = ApiRequest;
export type GetWalletsApiResponse = ApiResponse<
  {
    id: number;
    accountNumber: string;
    groupId: number;
    clientId: number;
    name: string;
    accountBalance: number;
    type: string;
  }[]
>;
