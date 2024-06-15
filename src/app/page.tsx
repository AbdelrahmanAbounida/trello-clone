"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaMedal } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/auth/logout";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Home() {
  const user = useCurrentUser();
  const { theme } = useTheme();

  return (
    <main
      className={cn(
        `first-letter:h-full flex-col w-full h-screen flex items-center justify-start pt-12 text-lg ${
          theme == "dark" ? "bg-black" : "bg-slate-100"
        }`
      )}
    >
      <div className="mt-[80px] max-w-2xl flex items-center justify-center flex-col">
        <div className="bg-[#FBF0C1] rounded-2xl mt-3 w-[280px] flex items-center justify-center gap-2 p-2 shadow-sm">
          <FaMedal fill="#9A4F18" />
          <span className="text-md capitalize text-[#9A4F18] font-semibold">
            No 1 Task Management
          </span>
        </div>

        <div className="mt-9 flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-bold">Trellofy helps team move</h1>
          {/* <div className="bg-sky-700 text-white font-bold w-[200px] px-2 py-3 rounded-lg text-2xl text-center mt-2">
            Work forward.
          </div> */}
          <div className="text-gray-400 font-medium text-center mt-3">
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to the home office, the way your team works is
            unique-accomplish it all with Trellofy
          </div>

          <div className="flex items-center gap-3">
            <Button className="p-5 mt-3 bg-sky-700 hover:bg-sky-600">
              <Link className=" text-xl p-5 text-white" href={"/main"}>
                {!user ? "Get Trellofy for free" : "Go To Main"}
              </Link>
            </Button>

            {user ? (
              <Button
                onClick={() => logout()}
                variant={"outline"}
                className={`${
                  theme == "light" && "bg-gray-200"
                } text-xl p-5 mt-3`}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant={"outline"}
                className={`${theme == "light" && "bg-gray-200"} p-5 mt-3`}
              >
                <Link className=" text-xl p-5 " href={"/login"}>
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
