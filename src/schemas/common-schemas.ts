import { ReactElement } from "react";
import { IconType } from "react-icons";

export interface ProfileAvatarProps {
  image?: string;
  name?: string;
  email?: string;
}

export interface SidebarItem {
  title: string;
  href: string;
  icon: ReactElement<IconType>;
}
