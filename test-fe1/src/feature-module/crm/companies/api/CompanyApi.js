import api from "../../../../utils/api";
import { getCompanyNameArr } from "../../../../utils/helpers/getDataArray";

const CompanyApi = {
  // get all companies
  async fetchCompanies(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/company", { params: restParams, signal });
    const companyNameArr = getCompanyNameArr(response?.data?.data);

    localStorage.setItem("companyNameArr", JSON.stringify(companyNameArr));

    return { data: response?.data };
  },

  // get Company by id
  async fetchCompany(params = {}) {
    const { companyId, ...restParams } = params;

    const response = await api.get(`/company/${companyId}`, {
      params: restParams,
    });
    return response?.data?.data;
  },

  // add a company
  async addCompany(companyData) {
    const response = await api.post("/company", companyData);

    return response?.data;
  },

  // update a company
  async updateCompany(id, companyData) {
    const response = await api.patch(`/company/${id}`, companyData);
    return response.data;
  },

  // get campaignNames
  async getAllCampaignNames(params = {}) {
    const { companyId, ...restParams } = params;

    const response = await api.get(
      `/company/operation/field/campaign/${companyId}`,
      {
        params: restParams,
      }
    );
    return response?.data?.data;
  },

  //   async updateTenant(id, data) {
  //     try {
  //       const response = await api.put(`/tenants/${id}`, data);
  //       return Tenant.fromApiResponse(response.data);
  //     } catch (error) {
  //       throw ApiErrorResponse.fromApiResponse(error);
  //     }
  //   },

  //   async deleteTenant(id) {
  //     try {
  //       const response = await api.delete(`/tenants/${id}`);
  //       return response.data;
  //     } catch (error) {
  //       throw ApiErrorResponse.fromApiResponse(error);
  //     }
  //   },
};

export default CompanyApi;
