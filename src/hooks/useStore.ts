import { BmiCategory } from "@/components/measures/calcBmi";
import { GgrCategory } from "@/components/measures/calcGGR";
import { Score2Result } from "@/components/measures/calcScore2";
import { create } from "zustand";

export type Gender = "male" | "female";

export interface DiabetesFormState {
  sex: Gender;
  age55to64: boolean;
  diabeticMother: boolean;
  diabeticFather: boolean;
  hypertension: boolean;
  blackRace: boolean;
  neverOrFormerDrinker: boolean;
  waistCm?: number;
  heightCm?: number;
  pulse?: number;
  glucoseMmol?: number;
  trigMmol?: number;
  hdlMmol?: number;
  uricUmol?: number;
}

type Store = {
  name: string | undefined;
  setName: (newName: string | undefined) => void;
  age: number | undefined;
  setAge: (newAge: number | undefined) => void;
  gender: Gender;
  setGender: (newGender: Gender) => void;
  weight: number | undefined;
  setWeight: (newWeight: number | undefined) => void;
  waist: number | undefined;
  setWaist: (newWaist: number | undefined) => void;
  height: number | undefined;
  setHeight: (newHeight: number | undefined) => void;
  systolic: number | undefined;
  setSystolic: (newSystolic: number | undefined) => void;
  nonHdl: number | undefined;
  setNonHdl: (newNonHdl: number | undefined) => void;
  comorbidity: boolean;
  setComorbidity: (newComorbidity: boolean) => void;
  smoking: boolean;
  setSmoking: (newSmoking: boolean) => void;
  bmi: number | undefined;
  setBmi: (newBmi: number | undefined) => void;
  bmiCategory: BmiCategory | undefined;
  setBmiCategory: (newBmiCategory: BmiCategory | undefined) => void;
  ggr: GgrCategory | undefined;
  setGgr: (newGGR: GgrCategory | undefined) => void;
  score2: Score2Result | undefined;
  setScore2: (newScore2: Score2Result | undefined) => void;
  diabetesPoints: number | undefined;
  setDiabetesPoints: (newDiabetes: number | undefined) => void;
  diabetesRisc: number | undefined;
  setDiabetesRisc: (newDiabetesRisc: number | undefined) => void;
  diabetesForm: DiabetesFormState | undefined;
  setDiabetesForm: (newDiabetesForm: DiabetesFormState | undefined) => void;
  texts: {
    overall_result_header: string | undefined;
    bmi_result_header: string | undefined;
    waist_result_header: string | undefined;
    hip_result_header: string | undefined;
    ggr_result_header: string | undefined;
    score2_result_header: string | undefined;
    diabetes_result_header: string | undefined;
  };
  setTexts: (newTexts: { i: string; content: string | undefined }) => void;
};

export const useStore = create<Store>()((set) => ({
  name: undefined,
  setName: (newName: string | undefined) => set({ name: newName }),
  age: undefined,
  setAge: (newAge: number | undefined) => set({ age: newAge }),
  gender: "male",
  setGender: (newGender: "male" | "female") => set({ gender: newGender }),
  weight: undefined,
  setWeight: (newWeight: number | undefined) => set({ weight: newWeight }),
  waist: undefined,
  setWaist: (newWaist: number | undefined) => set({ waist: newWaist }),
  height: undefined,
  setHeight: (newHeight: number | undefined) => set({ height: newHeight }),
  nonHdl: undefined,
  setNonHdl: (newNonHdl: number | undefined) => set({ nonHdl: newNonHdl }),
  systolic: undefined,
  setSystolic: (newSystolic: number | undefined) =>
    set({ systolic: newSystolic }),
  comorbidity: false,
  setComorbidity: (newComorbidity: boolean) =>
    set({ comorbidity: newComorbidity }),
  smoking: false,
  setSmoking: (newSmoking: boolean) => set({ smoking: newSmoking }),
  bmi: undefined,
  setBmi: (newBmi: number | undefined) => set({ bmi: newBmi }),
  bmiCategory: undefined,
  setBmiCategory: (newBmiCategory: BmiCategory | undefined) =>
    set({ bmiCategory: newBmiCategory }),
  ggr: undefined,
  setGgr: (newGGR: GgrCategory | undefined) => set({ ggr: newGGR }),
  score2: undefined,
  setScore2: (newScore2: Score2Result | undefined) =>
    set({ score2: newScore2 }),
  diabetesPoints: undefined,
  setDiabetesPoints: (newDiabetes: number | undefined) =>
    set({ diabetesPoints: newDiabetes }),
  diabetesRisc: undefined,
  setDiabetesRisc: (newDiabetesRisc: number | undefined) =>
    set({ diabetesRisc: newDiabetesRisc }),
  diabetesForm: undefined,
  setDiabetesForm: (newDiabetesForm: DiabetesFormState | undefined) =>
    set({ diabetesForm: newDiabetesForm }),
  texts: {
    overall_result_header: undefined,
    bmi_result_header: undefined,
    waist_result_header: undefined,
    hip_result_header: undefined,
    ggr_result_header: undefined,
    score2_result_header: undefined,
    diabetes_result_header: undefined,
  },
  setTexts: (newTexts: { i: string; content: string | undefined }) =>
    set((state) => ({
      texts: {
        ...state.texts,
        [newTexts.i]: newTexts.content,
      },
    })),
}));
