import { AdminResourceActionPage } from "@/admin/components/AdminResourceActionPage";

export const metadata = {
  title: "ویرایش رکورد | پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminEditPage({ params }: { params: Promise<{ id: string; resource: string }> }) {
  const { id, resource } = await params;

  return <AdminResourceActionPage action="edit" id={id} resource={resource} />;
}
