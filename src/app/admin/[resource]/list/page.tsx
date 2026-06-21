import { AdminResourceListPage } from "@/admin/components/AdminResourceListPage";

export const metadata = {
  title: "لیست پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;

  return <AdminResourceListPage resource={resource} />;
}
