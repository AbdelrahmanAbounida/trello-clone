"use client";
import { buttonVariants } from "@/components/ui/button";
import { SidenavbarItems } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import CreateWorkSpaceButton from "./create-ws-btn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LayoutSidebar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const currentPath = usePathname();

  const userOrganizations = ["Organization1", "Organization2"];

  return (
    <nav
      className={cn(
        "w-full h-full overflow-y-auto  flex flex-col  lg:space-y-0 space-y-2",
        className
      )}
      {...props}
    >
      <div className="mt-10 md:mt-0">
        <CreateWorkSpaceButton />
      </div>

      {/** ::TODO:: Add anthor map over current user list of opganization (Accordion) */}

      {userOrganizations.map((organization, idx) => (
        <Accordion
          key={idx}
          type="single"
          collapsible
          defaultValue={userOrganizations[0]}
          className="w-full flex flex-col space-y-2 "
        >
          <AccordionItem value={organization} className="border-none  ">
            <AccordionTrigger className="hover:no-underline hover:bg-muted my-0 py-2 p-2 rounded-md  font-semibold ">
              {organization}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col space-y-2 mt-2">
                {SidenavbarItems.map((item, index) => (
                  // Navbar Item
                  <Link
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      currentPath == item.href
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-muted",
                      "justify-start flex items-center gap-2 text-md font-medium space-x-1"
                    )}
                    key={index}
                    href={item.href}
                  >
                    <div className="font-semibold text-black text-[15px]">
                      {item.icon}
                    </div>
                    <div className="">{item.title}</div>
                  </Link>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </nav>
  );
};

export default LayoutSidebar;
