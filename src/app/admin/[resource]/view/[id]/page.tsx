import { AdminResourceActionPage } from "@/admin/components/AdminResourceActionPage";
import { redirect } from "next/navigation";

export const metadata = {
  title: "مشاهده رکورد | پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminViewPage({ params }: { params: Promise<{ id: string; resource: string }> }) {
  const { id, resource } = await params;

  if (resource === "menus") {
    redirect("/admin/categories/list");
  }

  return <AdminResourceActionPage action="view" id={id} resource={resource} />;
}
