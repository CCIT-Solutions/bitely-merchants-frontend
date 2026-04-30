import HttpHelpers from "@/services/helpers";
import { AxiosRequestConfig } from "axios";

const EventCategoriesApiEndpoints = {
  getAll: () => {
    return HttpHelpers.unAuthenticatedAxios
      .get("categories")
      .then((response) => response.data);
  },
};

export default EventCategoriesApiEndpoints;
