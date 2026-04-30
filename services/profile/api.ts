import HttpHelpers from "@/services/helpers";

const ProfileApiEndpoints = {
  myInterests: () => {
    return HttpHelpers.authenticatedAxios
      .get("/profile/interests")
      .then((response) => response.data);
  },
  myPastTickets: (page: number = 1) => {
    return HttpHelpers.authenticatedAxios
      .get(`/profile/tickets?past=true&page=${page}`)
      .then((response) => response.data);
  },
  myUpcomingTickets: (page: number = 1) => {
    return HttpHelpers.authenticatedAxios
      .get(`/profile/tickets?upcoming=true&page=${page}`)
      .then((response) => response.data);
  },
  user: () => {
    return HttpHelpers.authenticatedAxios
      .get("/profile/user")
      .then((response) => response.data);
  },
  chooseInterests: (data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post("/profile/interests", data)
      .then((response) => response.data);
  },
  updateProfile: (data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post("profile", data)
      .then((response) => response.data);
  },
  updateProfileAvatar: (data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post("profile/avatar", data)
      .then((response) => response.data);
  },
  updatePassword: (data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post("profile/update-password", data)
      .then((response) => response.data);
  },
  completeProfile: (data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post("profile/complete", data)
      .then((response) => response.data);
  },
};

export default ProfileApiEndpoints;