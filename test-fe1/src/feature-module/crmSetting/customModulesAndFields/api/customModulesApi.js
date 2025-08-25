import api from "../../../../utils/api";

const customModulesApi = {
  async fetchAllLayout(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/layout", { params: restParams, signal });

    return { data: response?.data };
  },

  async fetchModuleData({ id, ...params }) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get(`/layout/${id}`, {
      params: restParams,
      queryKey,
      signal,
    });
    return response?.data?.data;
  },

  // async addStage(stageData) {
  //   const response = await api.post(
  //     `/company/${stageData?.module}/contact-stage`,
  //     stageData
  //   );
  //   return response?.data;
  // },

  async updateModuleData({ id, updatedData }) {
    console.log(id, updatedData);

    const response = await api.patch(`/layout/${id}`, updatedData);
    console.log(response.data);

    return response.data;
  },

  // async updateStageOrder(data) {
  //   const response = await api.put(`/company/${data?.module}/contact-stage`, {
  //     ...data,
  //   });
  //   return response.data;
  // },
};

export default customModulesApi;
