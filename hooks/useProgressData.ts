import { useAllProgress } from "./useAllProgress";

export const useProgressData = () => {
  const { data, ...rest } = useAllProgress();

  return {
    progress: data?.progress || [],
    streak: data?.streak || 0,
    freezeCount: data?.freezeCount || 0,
    ...rest,
  };
};