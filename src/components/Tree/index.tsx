import { Tree as ADTree } from "antd";

import { useDirectoryStore, useFileStore, useTreeStore } from "@/store";
import { SourceType } from "@/enum";

import type { TreeProps as ADTreeProps } from "antd/es/tree";

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
  const [srcFileList, dstFileList] = useDirectoryStore((state) => [
    state.srcFileList,
    state.dstFileList,
  ]);
  const [srcTreeData, dstTreeData] = useTreeStore((state) => [
    state.srcTreeData,
    state.dstTreeData,
  ]);

  const onSelect = (selectedKeys: React.Key[]) => {
    if (sourceType === SourceType.SOURCE) {
      const curFile = srcFileList.find((file) => {
        return file.uid === selectedKeys[0]?.toString();
      });
      updateSrcFile(curFile!);
    } else {
      const curFile = dstFileList.find((file) => {
        return file.uid === selectedKeys[0]?.toString();
      });
      updateDstFile(curFile!);
    }
  };

  return (
    <ADTree
      showLine={true}
      onSelect={onSelect}
      treeData={sourceType === SourceType.SOURCE ? srcTreeData : dstTreeData}
    />
  );
};
