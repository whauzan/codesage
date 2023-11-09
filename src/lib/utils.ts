import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const getElapsed = (timeDiff: number, interval: number, unit: string) => {
    const value = Math.floor(timeDiff / interval);
    return `${value} ${value === 1 ? unit : unit + "s"} ago`;
  };

  if (timeDifference < minute) {
    return getElapsed(timeDifference, 1000, "second");
  } else if (timeDifference < hour) {
    return getElapsed(timeDifference, minute, "minute");
  } else if (timeDifference < day) {
    return getElapsed(timeDifference, hour, "hour");
  } else if (timeDifference < week) {
    return getElapsed(timeDifference, day, "day");
  } else if (timeDifference < month) {
    return getElapsed(timeDifference, week, "week");
  } else if (timeDifference < year) {
    return getElapsed(timeDifference, month, "month");
  } else {
    return getElapsed(timeDifference, year, "year");
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};
