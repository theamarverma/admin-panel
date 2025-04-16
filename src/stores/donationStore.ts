import { create } from "zustand";

import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";

export interface Donation {
  id?: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  message?: string | undefined;
}

interface DonationStore {
  donations: Donation[];
  addDonation: (donation: Donation) => void;
}

const useDonationStore = create<DonationStore>()(
  persist(
    immer((set) => ({
      donations: [],
      addDonation: (donation) => {
        set((state) => {
          state.donations.push({ ...donation, id: uuidv4() });
        });
      },
    })),
    {
      name: "donation-store",
    },
  ),
);

export default useDonationStore;
