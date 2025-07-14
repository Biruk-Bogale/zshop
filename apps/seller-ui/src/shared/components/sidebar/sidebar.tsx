"use client";

import React, { useEffect } from "react";
import UseSidebar from "../../../hooks/useSidebar";
import { usePathname } from "next/navigation";
import useSeller from "../../../hooks/useSeller";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
// import Logo from "apps/seller-ui/src/assets/svgs/logo";
import SidebarItem from "./sidebar.item";
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from "lucide-react";
import SidebarMenu from "./sidebar.menu";
import Image from "next/image";

const SideBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = UseSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#ff5100" : "#96969696";

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
        <Box>
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
                {seller?.shop?.name}
              </h3>
              <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>

      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={
              <LayoutDashboard
                strokeWidth={1}
                size={22}
                fill={getIconColor("/dashboard")}
              />
            }
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/orders"}
                title="Orders"
                icon={
                  <ListOrdered
                    strokeWidth={1}
                    size={22}
                    fill={getIconColor("/dashboard/orders")}
                  />
                }
                href="/dashboard/orders"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/payments"}
                title="Payments"
                icon={
                  <CreditCard
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/payments")}
                  />
                }
                href="/dashboard/payments"
              />
            </SidebarMenu>

            <SidebarMenu title="Products">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/create-product"}
                title="Create Product"
                icon={
                  <SquarePlus
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/create-product")}
                  />
                }
                href="/dashboard/create-product"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/all-product"}
                title="All Product"
                icon={
                  <PackageSearch
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/all-product")}
                  />
                }
                href="/dashboard/all-product"
              />
            </SidebarMenu>

            <SidebarMenu title="Events">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/create-event"}
                title="Create Event"
                icon={
                  <CalendarPlus
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/create-event")}
                  />
                }
                href="/dashboard/create-event"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/all-event"}
                title="All Event"
                icon={
                  <BellPlus
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/all-event")}
                  />
                }
                href="/dashboard/all-event"
              />
            </SidebarMenu>

            <SidebarMenu title="Controllers">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/inbox"}
                title="Inbox"
                icon={
                  <Mail
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/inbox")}
                  />
                }
                href="/dashboard/inbox"
              />

              <SidebarItem
                isActive={activeSidebar === "/dashboard/settings"}
                title="Settings"
                icon={
                  <Settings
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/settings")}
                  />
                }
                href="/dashboard/settings"
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

            <SidebarMenu title="Extras">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/discount-codes"}
                title="Discount Codes"
                icon={
                  <TicketPercent
                    strokeWidth={2}
                    size={22}
                    fill={getIconColor("/dashboard/discount-codes")}
                  />
                }
                href="/dashboard/discount-codes"
              />

              <SidebarItem
                isActive={activeSidebar === "/logout"}
                title="Logout"
                href="/logout"
                icon={
                  <LogOut
                    strokeWidth={2}
                    size={22}
                    // fill={getIconColor("/logout")}
                  />
                }
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
