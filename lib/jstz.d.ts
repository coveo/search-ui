interface jsTimeZoneDetect {
  determine: () => timezone;
  date_is_dst: (date: Date) => boolean;
  dst_start_for: (timeZone: string) => Date;
  TimeZone: (timeZoneName: string) => timezone;
}

interface timezone {
  name: () => string;
}

declare var jstz: jsTimeZoneDetect;