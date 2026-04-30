import HttpHelpers from "@/services/helpers";

const CartApiEndpoints = {
  getCart: (slug:string) => {
    return HttpHelpers.authenticatedAxios
      .get(`cart/${slug}`)
      .then((response) => response.data);
  },
  createCart: (slug:string,data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post(`cart/${slug}`, data)
      .then((response) => response.data);
  },
};

export default CartApiEndpoints;
