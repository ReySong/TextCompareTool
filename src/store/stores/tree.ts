import { create } from "zustand";

import type { DataNode as ADDataNode } from "antd/es/tree";

type TreeState = {
  srcTreeData: ADDataNode[];
  dstTreeData: ADDataNode[];
  updateSrcTreeData: (inputDataNode: ADDataNode[]) => void;
  updateDstTreeData: (inputDataNode: ADDataNode[]) => void;
};

export const useTreeStore = create<TreeState>((set) => ({
  srcTreeData: [],
  dstTreeData: [],
  updateSrcTreeData: (inputDataNode: ADDataNode[]) =>
    set(() => ({ srcTreeData: inputDataNode })),
  updateDstTreeData: (inputDataNode: ADDataNode[]) =>
    set(() => ({ dstTreeData: inputDataNode })),
}));
