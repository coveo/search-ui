interface jsTimeZoneDetect {
  determine: () => TimeZone;
  date_is_dst: (date: Date) => boolean;
  dst_start_for: (timeZone: string) => Date;
  TimeZone: (timeZoneName: string) => TimeZone;
}

interface TimeZone {
  name: () => string;
}

declare module "jstz" {
  export var jstz: jsTimeZoneDetect;
}

