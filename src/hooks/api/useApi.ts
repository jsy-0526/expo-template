import useSWR from "swr";
import { fetcher, type HttpError } from "../../infrastructure";

// mock type
export interface UseUsersParams {
  page?: number;
  limit?: number;
}

export function useUsers(params?: UseUsersParams) {
  return useSWR<any, HttpError>(params ? ["/users", params] : "/users", async () => {
    const res = await fetcher.get("/users", { params });
    console.log(res);
    
    return res.data;
  });
}

export interface UseUserParams {
  userId: string;
}

export function useUser({ userId }: UseUserParams) {
  return useSWR<any, HttpError>(userId ? ["/users", userId] : null, async () => {
    const res = await fetcher.get(`/users/${userId}`);
    return res.data;
  });
}

export interface UseUserPostsParams {
  userId: string;
  page?: number;
}

export function useUserPosts({ userId, page }: UseUserPostsParams) {
  return useSWR<any, HttpError>(userId ? ["/users", userId, "posts", page] : null, async () => {
    const res = await fetcher.post(`/users/${userId}/posts`, { page });
    return res.data;
  });
}
