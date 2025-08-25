import { useDispatch } from "react-redux";
import { isSuperAdmin } from "../../../utils/helpers/helper";

const RenderCompanyList = ({ formik, user, colClass, isEdit }) => {
  const companyNameArr = JSON.parse(localStorage.getItem("companyNameArr"));

  // Handle Non-Super Admin Scenario
  if (!isSuperAdmin(user)) {
    const companyValue = user?.ofCompany?._id || "N/A";

    // Set the formik value to ensure it's submitted correctly
    if (formik.values.ofCompany !== companyValue) {
      formik.setFieldValue("ofCompany", companyValue); // Update formik value for ofCompany
    }

    return (
      <div className={colClass}>
        <div className="mb-3">
          <label className="col-form-label">Company</label>
          <div className="input-group">
            <input
              name="ofCompany"
              className="form-control"
              type="text"
              value={user?.ofCompany?.name}
              disabled
            />
            <div className="input-group-text">
              <i className="ti ti-lock" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Super Admin Scenario
  return (
    <div className={colClass}>
      <div className="mb-3">
        <label className="col-form-label">
          Company{!isEdit ? <span className="text-danger">*</span> : null}
        </label>
        <div className="input-group">
          <select
            name="ofCompany"
            className="form-select"
            value={formik.values.ofCompany}
            onChange={(e) => {
              // Update formik state and dispatch the filter
              formik.setFieldValue("ofCompany", e.target.value);
            }}
          >
            <option value="">Select Company</option>
            {companyNameArr.map((company) => (
              <option key={company?.value} value={company?.value}>
                {company?.label}
              </option>
            ))}
          </select>
          <div className="input-group-text">
            <i className="ti ti-pencil" />
          </div>
        </div>
        {formik.touched.ofCompany && formik.errors.ofCompany && (
          <div className="text-danger">{formik.errors.ofCompany}</div>
        )}
      </div>
    </div>
  );
};

export default RenderCompanyList;
