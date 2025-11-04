import BreadCrumbs from "apps/admin-ui/src/shared/components/breadcrumbs";
import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen p-8">
      <h2 className="text-2xl text-white font-semibold mb2">Notifications</h2>

      {/* breadcrumbs */}
      <BreadCrumbs title="Notitications" />

      <p className="text-center pt-24 text-white text-sm font-Poppins">
        No Notifications available yet!
      </p>
    </div>
  );
};

export default page;
