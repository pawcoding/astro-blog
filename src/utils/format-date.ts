const formatter = new Intl.DateTimeFormat("en-us", { dateStyle: "medium" });

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return formatter.format(date);
}

export function formatDateMachine(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toISOString();
}
