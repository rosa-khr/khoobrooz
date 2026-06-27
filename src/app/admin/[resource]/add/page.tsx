import { AdminResourceActionPage } from "@/admin/components/AdminResourceActionPage";

export const metadata = {
  title: "ایجاد رکورد | پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminAddPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;

  return <AdminResourceActionPage action="add" resource={resource} />;
}
