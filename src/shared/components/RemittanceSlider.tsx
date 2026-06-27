import { type Locale } from "@/core/lib/site";
import RemittanceSliderClient from "./RemittanceSliderClient";

export function RemittanceSlider({ locale }: { locale: Locale }) {
  return <RemittanceSliderClient locale={locale} />;
}
