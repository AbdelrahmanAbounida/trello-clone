import {
  getAllworkspaces,
  getWorkspacebyId,
} from "@/actions/workspace/get-workspace";
import useSWR from "swr";

/**
all fetchers 
 */
const allWorkspacesfetcher = async ([key, userId]: [string, string]) => {
  const workspaces = await getAllworkspaces({ userId });
  return workspaces;
};

const specificworkspacesfetcher = async ([key, workspaceId]: [
  string,
  string
]) => {
  const workspaces = await getWorkspacebyId({ workspaceId });
  return workspaces;
};

/**
 *
 * Main hooks
 */
export const useCurrentWorkSpaces = (userId: string) => {
  const { data, error, isLoading } = useSWR(
    ["getAllworkspaces", userId],
    allWorkspacesfetcher
  );
  return { error, data, isLoading };
};

export const useSpecificWorkspace = (workspaceId: string) => {
  const { data, error, isLoading } = useSWR(
    ["getAllworkspaces", workspaceId],
    specificworkspacesfetcher
  );
  return { error, data, isLoading };
};
