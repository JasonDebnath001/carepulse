import { format } from 'date-fns';

export function formatDateTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return {
    dateTime: format(d, 'MMM d, yyyy h:mm a'), // e.g., "Jul 2, 2025 1:30 AM"
  };
}