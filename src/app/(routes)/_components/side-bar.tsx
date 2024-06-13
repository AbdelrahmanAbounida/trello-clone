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
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentWorkSpaces } from "@/hooks/use-current-ws";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { GoOrganization } from "react-icons/go";
import { useActiveWorkspace } from "@/hooks/use-active-ws";

const LayoutSidebar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const currentPath = usePathname();
  const currentWsId = currentPath.split("/").filter(Boolean)[0];
  const user = useCurrentUser();

  const { data: allWorkSpaces, isLoading } = useCurrentWorkSpaces(user?.id!);

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

      {isLoading ? (
        <SidebarSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          {allWorkSpaces?.map((Workspace, idx) => (
            <Accordion
              key={idx}
              type="single"
              collapsible
              defaultValue={currentWsId || allWorkSpaces[0]?.id}
              className="w-full flex flex-col space-y-2 "
            >
              <AccordionItem value={Workspace?.id!} className="border-none  ">
                <AccordionTrigger
                  className={cn(
                    " hover:no-underline hover:bg-muted my-0 py-2 p-2 rounded-md  font-semibold ",
                    currentWsId == Workspace?.id && "bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-4 w-full">
                    {Workspace?.logo ? (
                      <img
                        src={Workspace.logo}
                        alt="logo"
                        width={25}
                        height={25}
                      />
                    ) : (
                      <GoOrganization
                        size={25}
                        className="text-sky-700  font-bold"
                      />
                    )}
                    {Workspace?.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col space-y-2 mt-2">
                    {SidenavbarItems.map((item, index) => (
                      // Navbar Item
                      <Link
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          currentWsId == Workspace?.id &&
                            currentPath.includes(item.href)
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-muted",
                          "justify-start flex items-center gap-2 text-md font-medium space-x-1"
                        )}
                        key={index}
                        href={`/${Workspace.id}/${item.href}`}
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
        </div>
      )}

      {!isLoading && allWorkSpaces?.length == 0 && (
        <div className="flex flex-col h-full max-h-[100px] items-center justify-center rounded-xl  border border-dashed">
          <div className="flex items-center justify-center  w-full font-medium text-sm">
            You have no workspaces yet
          </div>
        </div>
      )}
    </nav>
  );
};

export default LayoutSidebar;

const SidebarSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col h-full  "
  >
    <div className="flex flex-col gap-8">
      {[1, 2].map((it, idx) => (
        <>
          <div className="gap-2 flex flex-col">
            <Skeleton className="w-full h-[20px]" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((item, index) => (
                <Skeleton className="w-full h-[35px]" key={index} />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  </motion.div>
);
