import { Timestamp } from 'firebase/firestore';

export const convertFirestoreTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export function formatDateToYYMMDD(date: Date) {
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};