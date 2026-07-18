import { AdminResourceListPage } from "@/admin/components/AdminResourceListPage";
import { redirect } from "next/navigation";

export const metadata = {
  title: "لیست پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;

  if (resource === "menus") {
    redirect("/admin/categories/list");
  }

  return <AdminResourceListPage resource={resource} />;
}
