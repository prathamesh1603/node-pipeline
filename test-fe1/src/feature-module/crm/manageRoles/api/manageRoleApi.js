import api from "../../../../utils/api";
import { getRoleNameArr } from "../../../../utils/helpers/getDataArray";

const RoleApi = {
  // get all roles
  async fetchRoles() {
    const response = await api.get("/role");
    const roleNameArr = getRoleNameArr(response?.data?.data);
    localStorage.setItem("roleNameArr", JSON.stringify(roleNameArr));
    return { data: response?.data };
  },

  //   // get Company by id
  //   async fetchCompany(id) {
  //     const response = await api.get(`/company/${id}`);
  //     return response?.data?.data;
  //   },

  // add a role
  async addRole(roleData) {
    const response = await api.post("/role", roleData);
    console.log(response);

    return response?.data;
  },

  // update a role
  async updateRole(data) {
    console.log(data);

    const response = await api.patch(`/role/${data.id}`, data.roleData);
    console.log(response);

    return response.data;
  },
};

export default RoleApi;
