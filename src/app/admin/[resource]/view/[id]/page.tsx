import { AdminResourceActionPage } from "@/admin/components/AdminResourceActionPage";

export const metadata = {
  title: "مشاهده رکورد | پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminViewPage({ params }: { params: Promise<{ id: string; resource: string }> }) {
  const { id, resource } = await params;

  return <AdminResourceActionPage action="view" id={id} resource={resource} />;
}
