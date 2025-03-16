import React, { ReactNode } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";

export const Layout = ({ children }: { children: ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
