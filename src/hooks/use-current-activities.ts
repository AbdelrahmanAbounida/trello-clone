import {
  getTaskActivities,
  getWorkspaceActivities,
} from "@/actions/activity/get-activity";
import useSWR from "swr";

const workspaceActivitiesFetcher = async ([key, workspaceId]: [
  string,
  string
]) => {
  const res = await getWorkspaceActivities({ workspaceId });
  return res;
};
const cardActivitiesFetcher = async ([key, taskId, columnId]: [
  string,
  string,
  string
]) => {
  const res = await getTaskActivities({ taskId, columnId });
  return res;
};

export const useCurrentActivities = (workspaceId: string) => {
  const { data, error, isLoading } = useSWR(
    ["getAllActivities", workspaceId],
    workspaceActivitiesFetcher
  );
  return { data: data?.details, error: error || data?.error, isLoading };
};

export const useTaskActivities = (taskId: string, columnId: string) => {
  const { data, error, isLoading } = useSWR(
    ["getTaskActivities", taskId, columnId],
    cardActivitiesFetcher
  );

  return { data: data?.details, error: error || data?.error, isLoading };
};
