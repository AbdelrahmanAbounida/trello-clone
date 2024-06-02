import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className={cn("text-xl font-bold font-poppin")}>
      <span className="text-sky-600 text-[25px]">T</span>rellofy
    </Link>
  );
};

export default Logo;
