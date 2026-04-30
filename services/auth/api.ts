import HttpHelpers from "../helpers";

const AuthApiEndpoints = {
  register: (data: unknown) => {
    return HttpHelpers.unAuthenticatedAxios
      .post("register", data)
      .then((response) => response.data);
  },

  login: (data: unknown) => {
    return HttpHelpers.unAuthenticatedAxios
      .post("login", data)
      .then((response) => response.data);
  },

  loginWithGoogle: () => {
    return HttpHelpers.unAuthenticatedAxios
      .get("oauth/google")
      .then((response) => response.data);
  },

  forgetPassword: (data: unknown) => {
    return HttpHelpers.unAuthenticatedAxios
      .post("forgot-password", data)
      .then((response) => response.data);
  },
  resetPassword: (data: {
    email: string
    password: string;
    password_confirmation: string;
    token: string;
  }) => {
    return HttpHelpers.unAuthenticatedAxios
      .post(`reset-password?email=${data.email}&token=${data.token}`, data)
      .then((response) => response.data);
  },

  logout: (data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post("logout", data)
      .then((response) => response.data);
  },
};

export default AuthApiEndpoints;
