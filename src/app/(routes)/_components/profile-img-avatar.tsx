import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ProfileAvatarProps } from "@/schemas/common-schemas";

import React from "react";

const ProfileImageAvatar = ({
  profileProps,
}: {
  profileProps: ProfileAvatarProps;
}) => {
  const { name, email, image } = profileProps;

  return (
    <Avatar className="bg-sky-100">
      <AvatarImage src={image} />
      <AvatarFallback className={cn(!image && "bg-sky-600 text-white")}>
        {name ? name?.slice(0, 2) : email?.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileImageAvatar;
