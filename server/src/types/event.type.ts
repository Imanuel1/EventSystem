const enum EventSource {
  ALERT_COMPANY = "alert company",
  EVENT_COMPANY = "event company",
  ROCKET_COMPANY = "rocket company",
}

export type EventType = {
  id: string;
  timestamp: Date;
  message: string;
  source: EventSource;
};
