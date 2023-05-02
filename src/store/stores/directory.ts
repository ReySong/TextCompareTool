import { create } from "zustand";

import type { UploadFile } from "antd";

type DirectoryState = {
  srcFileList: UploadFile[];
  dstFileList: UploadFile[];
  updateSrcFileList: (inputFile: UploadFile[]) => void;
  updateDstFileList: (inputFile: UploadFile[]) => void;
};

export const useDirectoryStore = create<DirectoryState>((set) => ({
  srcFileList: [],
  dstFileList: [],
  updateSrcFileList: (inputFileList: UploadFile[]) =>
    set(() => ({ srcFileList: inputFileList })),
  updateDstFileList: (inputFileList: UploadFile[]) =>
    set(() => ({ dstFileList: inputFileList })),
}));
