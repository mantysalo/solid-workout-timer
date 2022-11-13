import { formatDuration, intervalToDuration } from "date-fns";

export const formatRoundDuration = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

    const zeroPad = (num: number) => String(num).padStart(2, "0");

    const formatted = formatDuration(duration, {
      format: ["minutes", "seconds"],
      zero: true,
      delimiter: ":",
      locale: {
        formatDistance: (_token, count) => zeroPad(count),
      },
    });
    return formatted;
  };