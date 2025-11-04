import { useAtom } from "jotai";
import React from "react";
import { activeSidebarItem } from "../configs/constants";

const useSideBar = () => {
  const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarItem);

  return { activeSidebar, setActiveSidebar };
};

export default useSideBar;
