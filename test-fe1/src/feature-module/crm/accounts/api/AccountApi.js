import api from "../../../../utils/api";

const AccountApi = {
  // get all accounts
  async fetchAccounts(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/account", { params: restParams, signal });

    return { data: response?.data };
  },

  // get account by id
  async fetchAccount(accountId, params = {}) {
    const response = await api.get(`/account/${accountId}`, { params });
    return response?.data?.data;
  },

  // update a account
  async updateAccount(id, accountData) {
    const response = await api.patch(`/account/${id}`, accountData);
    return response.data;
  },
};

export default AccountApi;
