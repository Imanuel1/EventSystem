import { useEffect, useState } from "react";
import "./App.css";
import useSocket from "./hook/useSocket";
import { parseArrayToObject } from "./utils/utils";
import {
  addEventTopic,
  allEventsTopic,
  deleteEventTopic,
  updateEventTopic,
} from "./utils/environment";

export type EventType = {
  id: string;
  timestamp: Date;
  message: string;
  source: EventSource;
};

function App() {
  const { on, isConnected } = useSocket();
  const [events, setEvents] = useState<{ [key in string]: EventType }>({});
  const pageTitle = ": רשימת התראות ב24 שעות אחרונות";

  useEffect(() => {
    on(allEventsTopic, (data: string) => {
      setEvents(parseArrayToObject(JSON.parse(data)));
    });
    on(updateEventTopic, (data: string) => {
      const updatedEvent: EventType = JSON.parse(data);
      setEvents((prev) => {
        prev[updatedEvent.id] = updatedEvent;
        return { ...prev };
      });
    });
    on(addEventTopic, (data: string) => {
      const newEvent: EventType = JSON.parse(data);
      setEvents((prev) => {
        prev[newEvent.id] = newEvent;
        return { ...prev };
      });
    });
    on(deleteEventTopic, (data: string) => {
      const deletedEvent: EventType = JSON.parse(data);
      setEvents((prev) => {
        delete prev[deletedEvent.id];
        return { ...prev };
      });
    });
  }, [isConnected]);

  return (
    <div>
      <h3>{pageTitle}</h3>
      <div>
        {Object.values(events).map((item: EventType, index: number) => (
          <div key={index} className="card">
            <span>{`${item.timestamp} | ${item.source} | ${item.message}`}</span>
          </div>
        ))}
      </div>
      <p className="read-the-docs"></p>
    </div>
  );
}

export default App;
