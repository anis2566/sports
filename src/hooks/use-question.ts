import { create } from "zustand";

interface AddQuestionState {
  isOpen: boolean;
  productId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useAddQuestion = create<AddQuestionState>((set) => ({
  isOpen: false,
  productId: "",
  onOpen: (id: string) => set({ isOpen: true, productId: id }),
  onClose: () => set({ isOpen: false, productId: "" }),
}));


type Question = {
  questionId: string;
  productName: string;
  userName: string;
  question: string;
}

interface ViewQuestionState {
  isOpen: boolean;
  question: Question | null;
  onOpen: (question: Question) => void;
  onClose: () => void;
}

export const useViewQuestion = create<ViewQuestionState>((set) => ({
  isOpen: false,
  question: null,
  onOpen: (question: Question) => set({ isOpen: true, question }),
  onClose: () => set({ isOpen: false, question: null }),
}));


interface UserQuestionViewState {
  isOpen: boolean;
  question: string;
  answers: { answer: string; date: string }[] | null;
  onOpen: (question: string, answers: { answer: string; date: string }[]) => void;
  onClose: () => void;
}

export const useUserQuestionView = create<UserQuestionViewState>((set) => ({
  isOpen: false,
  question: "",
  answers: null,
  onOpen: (question: string, answers: { answer: string; date: string }[]) => set({ isOpen: true, question, answers }),
  onClose: () => set({ isOpen: false, question: "", answers: null }),
}));

interface DeleteQuestionState {
  isOpen: boolean;
  questionId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteQuestion = create<DeleteQuestionState>((set) => ({
  isOpen: false,
  questionId: "",
  onOpen: (id: string) => set({ isOpen: true, questionId: id }),
  onClose: () => set({ isOpen: false, questionId: "" }),
}));

interface AnswerQuestionState {
  isOpen: boolean;
  questionId: string;
  question: string;
  onOpen: (id: string, question: string) => void;
  onClose: () => void;
}

export const useAnswerQuestion = create<AnswerQuestionState>((set) => ({
  isOpen: false,
  questionId: "",
  question: "",
  onOpen: (id: string, question: string) => set({ isOpen: true, questionId: id, question }),
  onClose: () => set({ isOpen: false, questionId: "", question: "" }),
}));
