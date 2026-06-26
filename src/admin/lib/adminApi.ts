"use client";

import type { Accuracy } from "@/admin/data/adminMockData";

export type AdminResource = "menus" | "services" | "articles" | "news" | "tags" | "world-clocks";
export type AdminApiServiceAction = {
  id: number;
  name: string;
  title: string;
  method: "POST";
  path: string;
  scope: "Public" | "Admin";
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  status: "active" | "planned";
};

export type AdminApiServiceGroup = {
  id: number;
  serviceName: string;
  title: string;
  description: string;
  actions: AdminApiServiceAction[];
};

export type AdminMenuRecord = {
  id: number;
  title: string;
  parentId: number | null;
  parentTitle: string | null;
  url: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  level: 1 | 2 | 3;
  isPublished: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminContentRecord = {
  id: number;
  title: string;
  headline: string;
  categoryId: number | null;
  category: string | null;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  approve: boolean;
  isPublished: boolean;
  accuracy: Accuracy;
  scheduledAt: string | null;
  modifiedAt: string;
  tagIds?: number[];
  tagTitles?: string[];
};

export type AdminSimpleRecord = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
  description?: string;
  cta?: string;
  href?: string;
  isPublished?: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminCountryRecord = {
  id: number;
  nameFa: string;
  nameEn: string;
  iso2: string;
  iso3: string;
  capital: string | null;
  continent: string;
};

export type AdminCityOption = {
  id: number;
  city: string;
  cityEn: string;
  timezone: string;
  isTradeCity?: boolean;
};

export type AdminWorldClockRecord = {
  id: number;
  countryId: number | null;
  cityId: number | null;
  city: string;
  country: string;
  countryCode: string | null;
  continent: string;
  timezone: string;
  marketLabel: string | null;
  sortOrder: number;
  isPublished: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminGridRecord = AdminMenuRecord | AdminContentRecord | AdminSimpleRecord | AdminWorldClockRecord;

type AdminApiResponse<T> = {
  responseStatus: 0 | 1;
  response: {
    items: T[];
    total: number;
  };
  message?: string;
};

const adminApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "http://localhost:8000";
const defaultGridRequest = {
  pageing: {
    pageNumbber: 1,
    PageSize: 15
  },
  sorting: [],
  filters: {}
};
const lookupRequest = {
  pageing: {
    pageNumbber: 1,
    PageSize: 300
  },
  sorting: [],
  filters: {}
};

async function adminPost<T>(resource: AdminResource | "api-services" | "countries", action: string, body: Record<string, unknown> = {}) {
  const response = await fetch(`${adminApiBaseUrl}/api/admin/${resource}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json()) as AdminApiResponse<T>;

  if (!response.ok || payload.responseStatus === 0) {
    throw new Error(payload.message ?? "Admin API request failed.");
  }

  return payload;
}

export async function loadAdminPage(resource: AdminResource) {
  return adminPost<AdminGridRecord>(resource, "loadPage", defaultGridRequest);
}

export async function loadAdminLookup(resource: AdminResource, filters: Record<string, unknown> = {}) {
  return adminPost<AdminGridRecord>(resource, "loadPage", { ...lookupRequest, filters });
}

export async function loadApiServiceCatalog() {
  return adminPost<AdminApiServiceGroup>("api-services", "loadPage", defaultGridRequest);
}

export async function loadAdminCountries() {
  return adminPost<AdminCountryRecord>("countries", "loadPage", lookupRequest);
}

export async function loadAdminCountryCities(countryId: number) {
  return adminPost<AdminCityOption>("countries", "cities", { countryId });
}

export async function findAdminRecord(resource: AdminResource, id: string) {
  return adminPost<AdminGridRecord>(resource, "find", { id: Number(id) });
}

export async function saveAdminRecord(resource: AdminResource, action: "add" | "update", body: Record<string, unknown>) {
  return adminPost<AdminGridRecord>(resource, action, body);
}

export async function deleteAdminRecord(resource: AdminResource, id: number) {
  return adminPost<{ id: number; accuracy: 2 }>(resource, "delete", { id });
}
