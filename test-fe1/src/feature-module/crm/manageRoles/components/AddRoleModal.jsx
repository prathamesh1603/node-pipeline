import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import RoleApi from "../api/manageRoleApi";
import { toast } from "react-toastify";
import { setFetchRoleData } from "../../../../core/data/redux/authSlice";
import { useDispatch } from "react-redux";

const AddRoleModal = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [roleData, setRoleData] = useState({
    name: "",
  });

  const mutationAddRole = useMutation({
    mutationFn: RoleApi.addRole,
    onSuccess: () => {
      queryClient.invalidateQueries("roles");
      dispatch(setFetchRoleData());
      toast.success("Role added successfully.");
      // setRoleData({ name: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to add role.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData({
      ...roleData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!roleData.name) {
      toast.error("Please select a role.");
      return;
    }
    mutationAddRole.mutate(roleData);
  };

  return (
    <div className="modal fade" id="add_role" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Role</h5>
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              <i className="ti ti-x" />
            </Link>
          </div>
          <form>
            <div className="modal-body">
              <div className="mb-0">
                <label className="col-form-label">
                  Role Type <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  name="name"
                  value={roleData.name}
                  onChange={handleChange}
                  placeholder="Team Manager"
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  data-bs-dismiss="modal"
                  disabled={mutationAddRole.isPending}
                >
                  {mutationAddRole.isPending ? "Creating" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
