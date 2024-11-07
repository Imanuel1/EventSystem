const serverUrl: string =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
const allEventsTopic: string =
  import.meta.env.VITE_ALL_EVENT_TOPIC || "allEvents";
const updateEventTopic: string =
  import.meta.env.VITE_UPDATE_EVENT_TOPIC || "updateEvent";
const addEventTopic: string =
  import.meta.env.VITE_ADD_EVENT_TOPIC || "addEvent";
const deleteEventTopic: string =
  import.meta.env.VITE_DELETE_EVENT_TOPIC || "deleteEvent";
const eventInitTopic: string =
  import.meta.env.VITE_EVENT_INIT_TOPIC || "eventsInit";

export {
  serverUrl,
  allEventsTopic,
  updateEventTopic,
  addEventTopic,
  deleteEventTopic,
  eventInitTopic,
};
