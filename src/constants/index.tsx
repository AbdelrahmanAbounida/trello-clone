import { ReactElement } from "react";
import { IconType } from "react-icons";
import { BsGear, BsGrid1X2, BsHeartPulse, BsList } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";
import { GoPulse } from "react-icons/go";

export interface SidebarItem {
  title: string;
  href: string;
  icon: ReactElement<IconType>;
}

export const SidenavbarItems: SidebarItem[] = [
  {
    title: "Boards",
    href: "boards",
    icon: <BsGrid1X2 />,
  },
  {
    title: "Activity",
    href: "activity",
    icon: <GoPulse />,
  },
  {
    title: "Settings",
    href: "settings",
    icon: <BsGear />,
  },
  {
    title: "Billing",
    href: "billing",
    icon: <CiMoneyBill />,
  },
];
