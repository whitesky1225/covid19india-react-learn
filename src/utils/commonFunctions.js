import { formatISO, subDays,format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import {INDIA_ISO_SUFFIX,ISO_DATE_REGEX} from '../constants'

let locale = null;

export const isDevelopmentOrTest = () => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
    return true;
  return false;
};
export const fetcher = (url) => {
  return fetch(url).then((response) => {
    return response.json();
  });
};
export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
export const getIndiaDate = () => {
  return utcToZonedTime(new Date(), "Asia/Kolkata");
};
export const getIndiaDateISO = () => {
  return formatISO(getIndiaDate(), { representation: "date" });
};
export const getIndiaYesterdayISO = () => {
  return formatISO(subDays(getIndiaDate(), 1), { representation: "date" });
};
export const formatDate = (unformattedDate, formatString) => {
  if (!unformattedDate) return "";
  if (
    typeof unformattedDate === "string" &&
    unformattedDate.match(ISO_DATE_REGEX)
  )
    unformattedDate += INDIA_ISO_SUFFIX;
  const date = utcToZonedTime(new Date(unformattedDate), "Asia/Kolkata");
  return format(date, formatString, {
    locale: locale,
  });
};
