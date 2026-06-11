import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";

export const useFetch = <T>(endpoint: string) => {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string): Promise<T> => {
    const res = await fetch(url, {
      headers: {
        Authorization: token ?? "",
      },
    });

    if (!res.ok) {
      throw new Error("取得失敗");
    }

    const data: T = await res.json();
    return data;
  };

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<T>(
    token ? endpoint : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

//const categories = data?.categories ?? [];