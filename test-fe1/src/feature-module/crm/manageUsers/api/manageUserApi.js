import api from "../../../../utils/api";

const UserApi = {
  // get all users
  async fetchUsers(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/user", { params: restParams, signal });
    return { data: response?.data };
  },

  // get user by id
  async fetchUser(params = {}) {
    const { userId, queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get(`/user/${userId}`, {
      params: restParams,
      signal,
    });

    return response?.data?.data;
  },

  // add a user
  async addUser(userData) {
    const response = await api.post("/user", userData);

    return response?.data;
  },

  // update a user
  async updateUser(id, userData) {
    const response = await api.patch(`/user/changes/${id}`, userData);
    return response.data;
  },
};

export default UserApi;
