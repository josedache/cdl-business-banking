import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./store-actions";
import { User } from "../types/user.ts";

type InitialState = {
  authUser: User;
  isSideNavigation: boolean;
};

export const initialState: InitialState = {
  authUser: null,
  isSideNavigation: false,
};

export const slice = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    setAuthUser: (state, { payload }) => {
      state.authUser = payload;
    },
    toggleSideNavigation: (state, { payload }) => {
      state.isSideNavigation =
        payload !== undefined ? !!payload : !state.isSideNavigation;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(logout, () => ({ ...initialState })),
  // .addMatcher(
  //   userApi.endpoints.signupYieldUser.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser = { token: payload.data.token } as User;
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.signupYieldSecondStageUser.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser = { token: payload.data.token } as User;
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.iAgreeUser.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser = { token: payload.data.token } as User;
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.loginUser.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser = {
  //       // kyc_validation: getKyc(payload.data?.user),
  //       ...payload.data?.user,
  //       ...payload.data?.profile,
  //       token: payload?.data?.token,
  //       expiresIn: String(
  //         addSeconds(new Date(), payload?.data?.login_expiry)
  //       ),
  //       refreshToken: payload?.data?.refreshToken,
  //       isAuthenticated: true,
  //     } as User;
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.userRefreshToken.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser.token = payload.data.token;
  //     state.authUser.refreshToken = payload.data.refreshToken;
  //     state.authUser.expiresIn = String(
  //       addSeconds(new Date(), payload?.data?.login_expiry)
  //     );
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.sendUserResetPassword.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser = payload.data as User;
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.verifyUserResetPassword.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser.token = payload.data;
  //   }
  // )
  // .addMatcher(userApi.endpoints.resetPassword.matchFulfilled, (state) => {
  //   state.authUser = null;
  // })
  // .addMatcher(
  //   userApi.endpoints.getUserClientKyc.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser.alternate_number = payload?.data?.alternateMobileNo;
  //     state.authUser = Object.assign(state.authUser, payload.data, {
  //       kyc_validation: getKyc(payload.data),
  //     });
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.verifyUserClientKyc.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser.alternate_number = payload?.data?.alternateMobileNo;
  //     state.authUser = Object.assign(state.authUser, payload.data, {
  //       kyc_validation: getKyc(payload.data),
  //     });
  //   }
  // )
  // .addMatcher(
  //   userApi.endpoints.getUserSelfieFile.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser.avatar = isBase64DataURL(payload.data)
  //       ? payload.data
  //       : `data:image/png;base64,${payload.data}`;
  //   }
  // ),
});

export const { setAuthUser } = slice.actions;

export default slice;

export function getStorageState({ authUser }: typeof initialState) {
  return { authUser };
}
