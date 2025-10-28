import useSWR from "swr";
import { fetcher, type HttpError } from "../../infrastructure";

export interface UseGetCampaignsParams {
  status?: "active" | "scheduled" | "expired";
  accessible?: "ib" | "client" | "both";
  enabled?: boolean;
}

export function useGetCampaigns({ status, accessible, enabled }: UseGetCampaignsParams) {
  return useSWR<{
    id?: number;
    campaignCode?: string;
    title?: string;
    description?: string;
    pictureUrl?: string;
    accessible?: "ib" | "client" | "both";
    fromDate?: string;
    toDate?: string;
    enabled?: boolean;
    status?: "active" | "scheduled" | "expired";
    createdBy?: {
      id?: number;
      name?: string;
      email?: string;
    };
  }[], HttpError>(["/api/admin/v1/campaigns", status, accessible, enabled], async () => {
    const res = await fetcher.get(`/api/admin/v1/campaigns`, { params: { status, accessible, enabled } });
    return res.data;
  });
}

export function useCreateCampaign() {
  return useSWR<{
  id?: number;
  campaignCode?: string;
  title?: string;
  description?: string;
  createdBy?: number;
  createdAt?: string;
}, HttpError>("/api/admin/v1/campaigns", async () => {
    const res = await fetcher.post(`/api/admin/v1/campaigns`, {});
    return res.data;
  });
}

export interface UseGetCampaignByIdParams {
  id: string;
}

export function useGetCampaignById({ id }: UseGetCampaignByIdParams) {
  return useSWR<{
  id?: number;
  campaignCode?: string;
  title?: string;
  description?: string;
  pictureUrl?: string;
  accessible?: "ib" | "client" | "both";
  defaultFlag?: boolean;
  fromDate?: string;
  toDate?: string;
  enabled?: boolean;
  isPublic?: boolean;
  locales?: Record<string, any>;
  visibleToClients?: number[];
  createdBy?: {
    id?: number;
    name?: string;
    email?: string;
    preference?: {
      avatar?: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}, HttpError>(id ? ["/api/admin/v1/campaigns/{id}", id] : null, async () => {
    const res = await fetcher.get(`/api/admin/v1/campaigns/${id}`);
    return res.data;
  });
}

export interface UseDeleteCampaignParams {
  id: string;
}

export function useDeleteCampaign({ id }: UseDeleteCampaignParams) {
  return useSWR<{
  success?: boolean;
  id?: number;
}, HttpError>(id ? ["/api/admin/v1/campaigns/{id}", id] : null, async () => {
    const res = await fetcher.delete(`/api/admin/v1/campaigns/${id}`, {});
    return res.data;
  });
}

export interface UseUpdateCampaignParams {
  id: string;
}

export function useUpdateCampaign({ id }: UseUpdateCampaignParams) {
  return useSWR<{
  id?: number;
  title?: string;
  description?: string;
  updatedAt?: string;
}, HttpError>(id ? ["/api/admin/v1/campaigns/{id}", id] : null, async () => {
    const res = await fetcher.patch(`/api/admin/v1/campaigns/${id}`, {});
    return res.data;
  });
}
