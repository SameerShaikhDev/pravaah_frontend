import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import RedeemCodesPanel from "../../components/redeemCodes/RedeemCodesPanel";
import PageLoader from "../../components/common/PageLoader";
import collegeService from "../../services/college.service";
import { getErrorMessage } from "../../utils/formatters";

export default function ManageRedeemCodes() {
  const [colleges, setColleges] = useState(null);

  useEffect(() => {
    collegeService
      .list()
      .then((res) => setColleges(res.data.colleges || []))
      .catch((err) => {
        toast.error(getErrorMessage(err));
        setColleges([]);
      });
  }, []);

  if (colleges === null) return <PageLoader label="Loading colleges" />;

  if (!colleges.length) {
    return (
      <p className="text-sm text-ink-4 text-center py-16">
        Register a college first from "Colleges &amp; TPOs" before generating redeem codes.
      </p>
    );
  }

  return <RedeemCodesPanel colleges={colleges} />;
}
