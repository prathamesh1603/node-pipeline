import api from "../../../../utils/api";

const DealApi = {
  // get all deals
  async fetchDeals(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/deal", { params: restParams, signal });

    return { data: response?.data };
  },

  // get deal by id
  async fetchDeal(dealId, params = {}) {
    const response = await api.get(`/deal/${dealId}`, { params });

    return response?.data?.data;
  },

  // update a deal
  async updateDeal(id, dealData) {
    const response = await api.patch(`/deal/${id}`, dealData);
    return response.data;
  },

  // fetchDealsWithQuery for deals dashboard
  async fetchDealsWithQuery(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/analytics/deal", {
      params: restParams,
      signal,
    });
    return { data: response?.data };
  },
};

export default DealApi;
