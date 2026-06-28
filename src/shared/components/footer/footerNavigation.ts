import { type Locale, localizedPath } from "@/core/lib/site";
import { localizedNavigation, type NavigationItem } from "@/data/navigation";

type MenuResponse = {
  responseStatus: 0 | 1;
  response: {
    items: NavigationItem[];
    total: number;
  };
};

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://localhost:8000";

function localizeNavigationItem(locale: Locale, item: NavigationItem): NavigationItem {
  return {
    ...item,
    href: localizedPath(locale, item.href),
    children: item.children?.map((child) => localizeNavigationItem(locale, child))
  };
}

export async function loadFooterNavigation(locale: Locale) {
  const fallback = localizedNavigation(locale);

  try {
    const response = await fetch(`${backendApiBaseUrl}/api/v1/menus`, {
      cache: "no-store"
    });
    const payload = (await response.json()) as MenuResponse;

    if (!response.ok || payload.responseStatus !== 1 || payload.response.items.length === 0) {
      return fallback;
    }

    return payload.response.items.map((item) => localizeNavigationItem(locale, item));
  } catch {
    return fallback;
  }
}
