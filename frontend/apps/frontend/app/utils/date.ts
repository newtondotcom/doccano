import { format, parseISO } from "date-fns";

export const COMMENT_DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const PROJECT_DATETIME_FORMAT = "yyyy/MM/dd HH:mm";

export function formatApiDateTime(value: string, pattern: string): string {
  return format(parseISO(value), pattern);
}
