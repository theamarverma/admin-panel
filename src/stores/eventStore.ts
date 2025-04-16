import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
export enum PricingType {
  FREE = "free",
  PAID = "paid",
}

export interface Event {
  id: string;
  days: string[];
  title: string;
  image?: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  pricingType: "free" | "paid";
  price: number | undefined;
  details: string;
}

interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, "id">) => void;
  updateEvent: (updatedEvent: Event) => void;
  getEventById: (id: string) => Event | undefined;
  deleteEvent: (id: string) => void;
}

const useEventStore = create<EventStore>()(
  persist(
    immer((set, get) => ({
      events: [],
      addEvent: (event) => {
        set((state) => {
          state.events.push({ ...event, id: uuidv4() });
        });
      },
      updateEvent: (updatedEvent) => {
        set((state) => {
          const index = state.events.findIndex(
            (event: Event) => event.id === updatedEvent.id,
          );
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
        });
      },
      getEventById: (id: string) =>
        get().events.find((event) => event.id === id),
      deleteEvent: (id: string) => {
        set((state) => {
          state.events = state.events.filter((event: Event) => event.id !== id);
        });
      },
    })),
    {
      name: "event-store",
    },
  ),
);

export default useEventStore;
