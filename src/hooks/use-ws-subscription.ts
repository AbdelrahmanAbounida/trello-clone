import { validateSubscription } from "@/actions/stripe";
import useSWR from "swr";

const fetcher = async ([key, workspaceId]: [string, string]) => {
  const res = await validateSubscription({ workspaceId });
  return res;
};

export const useWSSubscription = (workspaceId: string) => {
  const { data, error, isLoading } = useSWR(
    ["checkWorksapceSubscription", workspaceId],
    fetcher
  );

  return { data, error, isLoading };
};
