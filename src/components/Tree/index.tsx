import { useEffect, useState } from "react";
import _ from "lodash";
import { Tree as ADTree } from "antd";

import { useDirectoryStore, useFileStore, useTreeStore } from "@/store";
import { SourceType } from "@/enum";

import type { TreeProps as ADTreeProps } from "antd/es/tree";

const { DirectoryTree } = ADTree;

export const Tree = (
  props: ADTreeProps & {
    sourceType: SourceType;
  }
) => {
  const { sourceType } = props;
  const [srcExpandedKeys, setSrcExpandedKeys] = useState<React.Key[]>([]);
  const [dstExpandedKeys, setDstExpandedKeys] = useState<React.Key[]>([]);

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

  const onExpand = (expandedKeys: React.Key[]) => {
    if (sourceType === SourceType.SOURCE) {
      setSrcExpandedKeys(expandedKeys);
    } else {
      setDstExpandedKeys(expandedKeys);
    }
    console.log("src", srcFileList);
  };

  useEffect(() => {
    if (sourceType === SourceType.SOURCE) {
      setSrcExpandedKeys(
        srcTreeData.map((node) => {
          return node.key;
        })
      );
    } else {
      setDstExpandedKeys(
        dstTreeData.map((node) => {
          return node.key;
        })
      );
    }
  }, [JSON.stringify(srcTreeData), JSON.stringify(dstTreeData)]);

  return (
    <DirectoryTree
      showLine={true}
      onSelect={onSelect}
      onExpand={onExpand}
      motion={{ delay: 0, duration: 0.3 }}
      expandedKeys={
        sourceType === SourceType.SOURCE ? srcExpandedKeys : dstExpandedKeys
      }
      treeData={sourceType === SourceType.SOURCE ? srcTreeData : dstTreeData}
    />
  );
};
