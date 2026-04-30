import HttpHelpers from "@/services/helpers";

const CategoriesApiEndpoints= {
  getAll: () => {
    return HttpHelpers.unAuthenticatedAxios
      .get("landing/categories")
      .then((response) => response.data);
  },
};

export default CategoriesApiEndpoints;
