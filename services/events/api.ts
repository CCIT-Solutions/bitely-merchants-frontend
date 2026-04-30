import HttpHelpers from "@/services/helpers";

const EventsApiEndpoints = {
  getAll: () => {
    return HttpHelpers.unAuthenticatedAxios
      .get("events")
      .then((response) => response.data);
  },
  getEventBySlug: (slug: string) => {
    return HttpHelpers.unAuthenticatedAxios
      .get(`events/${slug}`)
      .then((response) => response.data);
  },
   getEventTickets: (id: string) => {
    return HttpHelpers.unAuthenticatedAxios
      .get(`events/${id}/tickets`)
      .then((response) => response.data);
  },
   getEventCart: (slug: string) => {
    return HttpHelpers.authenticatedAxios
      .get(`events/${slug}/cart`)
      .then((response) => response.data);
  },
};

export default EventsApiEndpoints;
