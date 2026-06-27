export function formatPersianDateTime(value?: null | string) {
  if (!value) {
    return "";
  }

  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "medium",
    hourCycle: "h23",
    timeStyle: "short"
  }).format(date);
}
