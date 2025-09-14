import { create } from "zustand";

interface SignupData {
  name: string;
  phone: string;
  dob: string;
  location: string;
  email?: string;
  password?: string;
  gstin?: string;
}

interface SignupState {
  data: SignupData;
  setData: (partial: Partial<SignupData>) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  data: {
    name: "",
    phone: "",
    dob: "",
    location: "",
  },
  setData: (partial) =>
    set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () =>
    set({
      data: { name: "", phone: "", dob: "", location: "" },
    }),
}));
