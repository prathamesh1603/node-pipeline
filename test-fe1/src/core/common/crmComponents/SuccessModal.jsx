import React from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const SuccessModal = ({ message, openModal2, setOpenModal2 }) => {
  return (
    <Modal show={openModal2} onHide={() => setOpenModal2(false)}>
      <div className="modal-header border-0 m-0 justify-content-end">
        <button
          className="btn-close"
          aria-label="Close"
          onClick={() => setOpenModal2(false)}
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="modal-body">
        <div className="success-message text-center">
          <div className="success-popup-icon bg-light-blue">
            <i className="ti ti-user-plus" />
          </div>
          <h3>{message} Successfully!</h3>
          {/* <p>View the details of the created company.</p> */}
          <div className="col-lg-12 text-center modal-btn">
            <Link
              to="#"
              className="btn btn-light"
              onClick={() => setOpenModal2(false)}
            >
              Okay
            </Link>
            {/* <Link to={route.companyDetails} className="btn btn-primary">
            View Details
          </Link> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
