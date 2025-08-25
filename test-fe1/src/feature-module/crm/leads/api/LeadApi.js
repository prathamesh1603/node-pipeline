import api from "../../../../utils/api";

const LeadApi = {
  // get all leads
  async fetchLeads(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/lead", { params: restParams, signal });
    return { data: response?.data };
  },

  // get lead by id
  async fetchLead(leadId, params = {}) {
    const response = await api.get(`/lead/${leadId}`, { params });
    return response?.data?.data;
  },

  // add a lead
  async addLead(leadData) {
    const response = await api.post("/lead", leadData);

    return response?.data;
  },

  // update a lead
  async updateLead(id, leadData) {
    const response = await api.patch(`/lead/${id}`, leadData);
    return response.data;
  },
  async changleLeadOwner(leadIdList, callerId) {
    const response = await api.patch(`/lead/operation/bulk-lead-assignment`, {
      callerId,
      leadIdList,
    });
    return response.data;
  },

  // fetchLeadsWithQuery for leads dashboard
  async fetchLeadsWithQuery(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/analytics/lead", {
      params: restParams,
      signal,
    });
    return { data: response?.data };
  },
};

export default LeadApi;
