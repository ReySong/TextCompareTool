import { create } from "zustand";

import type { UploadFile } from "antd";
import type { Mode } from "@/type";

type FileState = {
  diffMode: Mode;
  setDiffMode: (inputMode: Mode) => void;
};

export const useDiffModeStore = create<FileState>((set) => ({
  diffMode: "char",
  setDiffMode: (inputMode: Mode) => set(() => ({ diffMode: inputMode })),
}));
