import { redirect } from "next/navigation";
import { defaultLocale } from "@/core/lib/site";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
