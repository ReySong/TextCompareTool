import { Tree as ADTree } from "antd";

import { useFileStore, useTreeStore } from "@/store";
import { SourceType } from "@/enum";

import type { TreeProps as ADTreeProps } from "antd/es/tree";

const { DirectoryTree } = ADTree;

export const Tree = (
  props: ADTreeProps & {
    sourceType: SourceType;
  }
) => {
  const { sourceType } = props;
  const [updateSrcFile, updateDstFile] = useFileStore((state) => [
    state.updateSrcFile,
    state.updateDstFile,
  ]);
  const [srcTreeData, dstTreeData] = useTreeStore((state) => [
    state.srcTreeData,
    state.dstTreeData,
  ]);

  const onSelect = (info: any) => {
    if (sourceType === SourceType.SOURCE) {
      updateSrcFile(info);
    } else {
      updateDstFile(info);
    }
  };

  return (
    <div>
      <DirectoryTree
        {...props}
        showLine={true}
        defaultExpandedKeys={["0-0-0"]}
        onSelect={onSelect}
        treeData={sourceType === SourceType.SOURCE ? srcTreeData : dstTreeData}
      />
    </div>
  );
};
