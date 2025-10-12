import { create } from "zustand";

export type GGR =
  | "lightIncreased"
  | "moderateIncreased"
  | "highIncreased"
  | "extremeIncreased"
  | null;

type Store = {
  name: string | null;
  setName: (newName: string) => void;
  age: number | null;
  setAge: (newAge: number | null) => void;
  gender: "male" | "female" | null;
  setGender: (newGender: "male" | "female") => void;
  weight: number | null;
  setWeight: (newWeight: number) => void;
  hip: number | null;
  setHip: (newHip: number) => void;
  waist: number | null;
  setWaist: (newWaist: number) => void;
  waistHip: number | null;
  setWaistHip: (newWaistHip: number | null) => void;
  height: number | null;
  setHeight: (newHeight: number) => void;
  bmi: number | null;
  setBmi: (newBmi: number | null) => void;
  bmiCategory: string | null;
  setBmiCategory: (newBmiCategory: string | null) => void;
  ggr: GGR;
  setGgr: (newGGR: GGR) => void;
  ascvd: number | null;
  setAscvd: (newAscvd: number | null) => void;
  diabetes: number | null;
  setDiabetes: (newDiabetes: number | null) => void;
  texts: {
    overall_result_header: string | null;
    bmi_result_header: string | null;
    waist_result_header: string | null;
    hip_result_header: string | null;
    ggr_result_header: string | null;
    ascvd_result_header: string | null;
    diabetes_result_header: string | null;
  };
  setTexts: (newTexts: { i: string; content: string | null }) => void;
};

export const useStore = create<Store>()((set) => ({
  name: null,
  setName: (newName: string) => set({ name: newName }),
  age: null,
  setAge: (newAge: number | null) => set({ age: newAge }),
  gender: null,
  setGender: (newGender: "male" | "female") => set({ gender: newGender }),
  weight: null,
  setWeight: (newWeight: number) => set({ weight: newWeight }),
  hip: null,
  setHip: (newHip: number) => set({ hip: newHip }),
  waist: null,
  setWaist: (newWaist: number) => set({ waist: newWaist }),
  waistHip: null,
  setWaistHip: (newWaistHip: number | null) => set({ waistHip: newWaistHip }),
  height: null,
  setHeight: (newHeight: number) => set({ height: newHeight }),
  bmi: null,
  setBmi: (newBmi: number | null) => set({ bmi: newBmi }),
  bmiCategory: null,
  setBmiCategory: (newBmiCategory: string | null) =>
    set({ bmiCategory: newBmiCategory }),
  ggr: null,
  setGgr: (newGGR: GGR) => set({ ggr: newGGR }),
  ascvd: null,
  setAscvd: (newAscvd: number | null) => set({ ascvd: newAscvd }),
  diabetes: null,
  setDiabetes: (newDiabetes: number | null) => set({ diabetes: newDiabetes }),
  texts: {
    overall_result_header: null,
    bmi_result_header: null,
    waist_result_header: null,
    hip_result_header: null,
    ggr_result_header: null,
    ascvd_result_header: null,
    diabetes_result_header: null,
  },
  setTexts: (newTexts: { i: string; content: string | null }) =>
    set((state) => ({
      texts: {
        ...state.texts,
        [newTexts.i]: newTexts.content,
      },
    })),
}));
