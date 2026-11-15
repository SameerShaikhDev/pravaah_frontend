import React from "react";
import RedeemCodesPanel from "../../components/redeemCodes/RedeemCodesPanel";

// No `collegeId` prop needed here - the backend resolves a TPO's college from their own
// account, and RedeemCodesPanel omits the college picker whenever `colleges` isn't passed.
export default function TpoRedeemCodes() {
  return <RedeemCodesPanel />;
}
