import { create } from "zustand";

import type { UploadFile } from "antd";

type FileState = {
  srcFile: UploadFile | null;
  dstFile: UploadFile | null;
  updateSrcFile: (inputFile: UploadFile) => void;
  updateDstFile: (inputFile: UploadFile) => void;
};

export const useFileStore = create<FileState>((set) => ({
  srcFile: null,
  dstFile: null,
  updateSrcFile: (inputFile: UploadFile) => set(() => ({ srcFile: inputFile })),
  updateDstFile: (inputFile: UploadFile) => set(() => ({ dstFile: inputFile })),
}));
