import api from "../../../../utils/api";

const stagesApi = {
  async fetchContactStages(params = {}) {
    const { module, ofCompany, queryKey, signal, ...restParams } = params;
    const response = await api.get(
      `/company/${module}/contact-stage/${ofCompany}`,
      {
        params: restParams,
        signal,
      }
    );
    return { data: response?.data };
  },

  //   // get Company by id
  //   async fetchCompany(id) {
  //     const response = await api.get(`/company/${id}`);
  //     return response?.data?.data;
  //   },

  async addStage(stageData) {
    const response = await api.post(
      `/company/${stageData?.module}/contact-stage`,
      stageData
    );
    return response?.data;
  },

  async updateStage(data) {
    const response = await api.patch(
      `/company/${data?.module}/contact-stage`,
      data
    );
    return response.data;
  },
  async updateStageOrder(data) {
    const response = await api.put(`/company/${data?.module}/contact-stage`, {
      ...data,
    });
    return response.data;
  },
};

export default stagesApi;
