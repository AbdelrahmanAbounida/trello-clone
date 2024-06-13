"use client";
import LayoutSidebar from "./_components/side-bar";
import Navbar from "./_components/nav-bar";
import { motion } from "framer-motion";
import { useGlobalLoading } from "@/hooks/use-global-loading";

export default function RoutesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-full w-full     ">
      <div className="flex items-center h-full   flex-col">
        {/** Navbar */}
        <div className="border-b w-full  shadow-sm">
          <div className="w-full container ">
            <Navbar />
          </div>
        </div>

        <div className="w-full md:container flex items-center h-full space-x-0 md:space-x-7 p-3 mt-7 ">
          {/** sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full left-0 min-w-56  hidden md:flex"
          >
            <LayoutSidebar />
          </motion.div>

          {/** main pages */}
          <div className="flex-1   h-full pl-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
