import { AdminResourceActionPage } from "@/admin/components/AdminResourceActionPage";
import { redirect } from "next/navigation";

export const metadata = {
  title: "ایجاد رکورد | پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminAddPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;

  if (resource === "menus") {
    redirect("/admin/categories/list");
  }

  return <AdminResourceActionPage action="add" resource={resource} />;
}
