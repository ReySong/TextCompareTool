import { create } from "zustand";

import type { UploadFile } from "antd";

type FileState = {
  srcFile: UploadFile | null;
  dstFile: UploadFile | null;
  updateSrcFile: (inputFile: UploadFile | null) => void;
  updateDstFile: (inputFile: UploadFile | null) => void;
  removeSrcFile: () => void;
  removeDstFile: () => void;
};

export const useFileStore = create<FileState>((set) => ({
  srcFile: null,
  dstFile: null,
  updateSrcFile: (inputFile: UploadFile | null) =>
    set(() => ({ srcFile: inputFile })),
  updateDstFile: (inputFile: UploadFile | null) =>
    set(() => ({ dstFile: inputFile })),
  removeSrcFile: () => set(() => ({ srcFile: null })),
  removeDstFile: () => set(() => ({ dstFile: null })),
}));
