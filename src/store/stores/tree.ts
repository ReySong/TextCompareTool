import { create } from "zustand";

import type { DataNode as ADDataNode } from "antd/es/tree";

type TreeState = {
  srcTreeData: ADDataNode[];
  dstTreeData: ADDataNode[];
  updateSrcFile: (inputDataNode: ADDataNode[]) => void;
  updateDstFile: (inputDataNode: ADDataNode[]) => void;
};

export const useTreeStore = create<TreeState>((set) => ({
  srcTreeData: [],
  dstTreeData: [],
  updateSrcFile: (inputDataNode: ADDataNode[]) =>
    set(() => ({ srcTreeData: inputDataNode })),
  updateDstFile: (inputDataNode: ADDataNode[]) =>
    set(() => ({ dstTreeData: inputDataNode })),
}));
