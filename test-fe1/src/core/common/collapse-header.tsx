import React from "react";
import { setHeaderCollapse } from "../data/redux/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CollapseHeader = () => {
  const dispatch = useDispatch();
  const { headerCollapse } = useSelector((state: any) => state.crms);

  const toggleHeaderCollapse = () => {
    dispatch(setHeaderCollapse(!headerCollapse));
  };

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="collapse-tooltip">Collapse</Tooltip>}
    >
      <div
        id="collapse-header"
        onClick={toggleHeaderCollapse}
        role="button"
        tabIndex={0} // Makes it keyboard accessible
        onKeyDown={(e) => e.key === "Enter" && toggleHeaderCollapse()} // Handle Enter key
      >
        <i className="ti ti-chevrons-up" />
      </div>
    </OverlayTrigger>
  );
};

export default CollapseHeader;
