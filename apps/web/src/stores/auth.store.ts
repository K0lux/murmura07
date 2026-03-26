export type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

export const authStoreInitialState: AuthStoreState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false
};
