import { getAllBoards } from "@/actions/board/get-board";
import useSWR from "swr";

const fetcher = async ([key, workspaceId]: [string, string]) => {
  const res = await getAllBoards({ workspaceId });
  return res;
};

export const useCurrentBoards = (workspaceId: string) => {
  const { data, error, isLoading } = useSWR(
    ["getAllBoards", workspaceId],
    fetcher
  );
  return { data, error, isLoading };
};
