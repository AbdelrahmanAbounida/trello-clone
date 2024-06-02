// "use server";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const { session } = useCurrentSession(); // clientside but u can't call it before auth (serverside)
  const session = await auth(); // server side

  return <SessionProvider session={session}>{children}</SessionProvider>;
};
