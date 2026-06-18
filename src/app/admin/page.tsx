import AdminDashboard from "@/admin/components/AdminDashboard";

export const metadata = {
  title: "پنل مدیریت خوبروز",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminDashboard />;
}
