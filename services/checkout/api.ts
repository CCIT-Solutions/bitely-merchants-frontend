import HttpHelpers from "@/services/helpers";

const CheckoutApiEndpoints = {
  getCheckout: (slug: string) => {
    return HttpHelpers.authenticatedAxios
      .get(`checkout/${slug}`)
      .then((response) => response.data);
  },
  getCheckoutThank: (id: string) => {
    return HttpHelpers.authenticatedAxios
      .get(`checkout/payment/${id}/thanks`)
      .then((response) => response.data);
  },
  createCheckout: (slug: string, data: unknown) => {
    return HttpHelpers.authenticatedAxios
      .post(`checkout/${slug}`, data)
      .then((response) => response.data);
  },
};

export default CheckoutApiEndpoints;
