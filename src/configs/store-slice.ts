import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./store-actions";
import { AuthUser } from "../types/user.ts";
import { userApi } from "apis/user.ts";
import { addSeconds } from "utils/date/add-seconds.ts";

type InitialState = {
  authUser: AuthUser;
  isSideNavigation: boolean;
  isIconSidebar: boolean;
};

export const initialState: InitialState = {
  authUser: null,
  isSideNavigation: false,
  isIconSidebar: true,
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
    toggleIconSidebar: (state, { payload }) => {
      state.isIconSidebar =
        payload !== undefined ? !!payload : !state.isIconSidebar;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(logout, () => ({ ...initialState }))
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
      .addMatcher(
        userApi.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          state.authUser = {
            token: payload?.data?.token,
            expiresIn: String(
              addSeconds(new Date(), payload?.data?.expireTime)
            ),
          } as AuthUser;
        }
      )
      .addMatcher(
        userApi.endpoints.verifyUserOtp.matchFulfilled,
        (state, { payload }) => {
          state.authUser = {
            info: payload?.data?.user,
            token: payload?.data?.token,
            expiresIn: String(
              addSeconds(new Date(), payload?.data?.loginExpiry)
            ),
            refreshToken: payload?.data?.refreshToken,
            refreshExpiresIn: String(
              addSeconds(new Date(), payload?.data?.refreshExpiry)
            ),
            isAuthenticated: true,
          } as AuthUser;
        }
      )
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
      .addMatcher(
        userApi.endpoints.sendUserResetPassword.matchFulfilled,
        (state, { payload }) => {
          state.authUser = { token : payload?.token }
        }
      )
      .addMatcher(
        userApi.endpoints.verifyUserResetPassword.matchFulfilled,
        (state, { payload }) => {
          state.authUser.token = payload?.data?.token;
        }
      )
      .addMatcher(userApi.endpoints.resetPassword.matchFulfilled, (state) => {
        state.authUser = null;
      })
      .addMatcher(
        userApi.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.authUser.info = payload.data;
        }
      ),
  // .addMatcher(
  //   userApi.endpoints.getUserSelfieFile.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser.avatar = isBase64DataURL(payload.data)
  //       ? payload.data
  //       : `data:image/png;base64,${payload.data}`;
  //   }
  // ),
});

export const { setAuthUser, toggleIconSidebar } = slice.actions;

export default slice;

export function getStorageState({ authUser }: typeof initialState) {
  return { authUser };
}
