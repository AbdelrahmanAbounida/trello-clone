"use client";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CiMenuBurger } from "react-icons/ci";
import LayoutSidebar from "./side-bar";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import ProfileAvatar from "./profile-avatar";
import ModeToggle from "./mode-toggle";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import BoardModal from "@/components/modals/board-modal";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const user = useCurrentUser();
  const { data: session, status, update } = useSession();

  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    // if(!isMounted){return null}
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null; // <Skeleton className="w-full h-[60px] rounded-md" />;
  }

  return (
    <div className="w-full text-md  flex items-center justify-between    p-0">
      <div className="flex items-center gap-3 py-4">
        {/** 1- sheet for sidebar */}
        <Sheet>
          <SheetTrigger asChild className="flex md:hidden ">
            <Button variant={"ghost"}>
              <CiMenuBurger className="w-4 h-4 " />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-[300px]">
            <LayoutSidebar />
          </SheetContent>
        </Sheet>

        {/** 2- Logo */}
        <Logo />
        {/** 3- Create Board Button */}
        <BoardModal />
      </div>

      <div className="flex items-center gap-3 ">
        {/** Toggle them */}
        <ModeToggle />
        {/** account avatar */}
        <ProfileAvatar
          image={user?.image as string}
          name={user?.name as string}
          email={user?.email as string}
        />
      </div>
    </div>
  );
};

export default Navbar;
