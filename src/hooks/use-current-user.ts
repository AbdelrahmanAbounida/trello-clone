import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  return session?.data?.user;
};

export const useCurrentSession = () => {
  const { data: session, status, update } = useSession();
  return { session, status, update };
};
