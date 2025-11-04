"use client";
import useAdmin from "apps/admin-ui/src/hooks/useAdmin";
import useSideBar from "apps/admin-ui/src/hooks/useSideBar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import Image from "next/image";
import {
  BellPlus,
  BellRing,
  CreditCard,
  FileClock,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  PackageSearch,
  PencilRuler,
  Settings,
  Store,
  Users,
} from "lucide-react";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu";
// import Logo from "apps/admin-ui/src/assets/logo";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSideBar();
  const pathName = usePathname();
  const { admin } = useAdmin();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#ff4800" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Link href={"/"} className="flex justify-center text-center gap-2">
          {/* <Logo /> */}
          <Image
            src={"/logo.png"}
            width={35}
            height={35}
            alt="logo"
            className="bg-white w-auto"
          />
          <Box>
            <h3 className="text-xl font-medium text-[#ecedee]">
              {admin?.name}
            </h3>
            <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
              {admin?.email}
            </h5>
          </Box>
        </Link>
      </Sidebar.Header>

      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<LayoutDashboard fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href={"/dashboard"}
          />
          <div className="mt-2 block">
            <SidebarMenu title={"Main Menu"}>
              <SidebarItem
                isActive={activeSidebar === "/dashboard/orders"}
                title="Orders"
                href={"/dashboard/orders"}
                icon={
                  <ListOrdered
                    size={26}
                    fill={getIconColor("/dashboard/orders")}
                  />
                }
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/payments"}
                title="Payments"
                href={"/dashboard/payments"}
                icon={
                  <CreditCard
                    size={26}
                    fill={getIconColor("/dashboard/payments")}
                  />
                }
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/products"}
                title="Products"
                href={"/dashboard/products"}
                icon={
                  <PackageSearch
                    size={26}
                    fill={getIconColor("/dashboard/products")}
                  />
                }
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/events"}
                title="Events"
                icon={
                  <BellPlus
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/events")}
                  />
                }
                href="/dashboard/events"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/users"}
                title="Users"
                icon={
                  <Users
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/users")}
                  />
                }
                href="/dashboard/users"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/sellers"}
                title="Sellers"
                icon={
                  <Store
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/sellers")}
                  />
                }
                href="/dashboard/sellers"
              />
            </SidebarMenu>

            <SidebarMenu title={"Controllers"}>
              <SidebarItem
                isActive={activeSidebar === "/dashboard/loggers"}
                title="Loggers"
                icon={
                  <FileClock
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/loggers")}
                  />
                }
                href="/dashboard/loggers"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/management"}
                title="Management"
                icon={
                  <Settings
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/management")}
                  />
                }
                href="/dashboard/management"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/notifications"}
                title="Notifications"
                icon={
                  <BellRing
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/notifications")}
                  />
                }
                href="/dashboard/notifications"
              />
            </SidebarMenu>

            <SidebarMenu title={"Customization"}>
              <SidebarItem
                isActive={activeSidebar === "/dashboard/customization"}
                title="All Customization"
                icon={
                  <PencilRuler
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/customization")}
                  />
                }
                href="/dashboard/customization"
              />
            </SidebarMenu>

            <SidebarMenu title={"Extras"}>
              <SidebarItem
                isActive={activeSidebar === "/logout"}
                title="Logout"
                icon={<LogOut size={22} fill={getIconColor("/logout")} />}
                href="/"
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
