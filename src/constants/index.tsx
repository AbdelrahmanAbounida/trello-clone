import { SidebarItem } from "@/schemas/common-schemas";
import { BsGear, BsGrid1X2 } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";
import { GoPulse } from "react-icons/go";

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
