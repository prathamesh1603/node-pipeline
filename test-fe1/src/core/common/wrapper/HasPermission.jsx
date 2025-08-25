import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function HasPermission({ module, action, children }) {
  // action will be create,read,update,delete
  const { user } = useSelector((state) => state.auth);

  let grant = false;
  grant = user?.role?.control[module]?.includes(action) || false;
  //
  return <>{grant && children}</>;
}
