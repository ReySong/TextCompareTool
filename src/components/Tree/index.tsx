import { useEffect, useState } from "react";
import _ from "lodash";
import { Tree as ADTree, UploadFile } from "antd";

import { useFileStore } from "@/store";
import { SourceType } from "@/enum";

import type { TreeProps as ADTreeProps, DataNode } from "antd/es/tree";

const { DirectoryTree } = ADTree;

export const Tree = (
  props: ADTreeProps & {
    sourceType: SourceType;
    fileList: UploadFile[];
    treeData: DataNode[];
  }
) => {
  const { sourceType, fileList, treeData } = props;
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [updateSrcFile, updateDstFile] = useFileStore((state) => [
    state.updateSrcFile,
    state.updateDstFile,
  ]);

  const onSelect = (selectedKeys: React.Key[]) => {
    const curFile = fileList.find((file) => {
      return file.uid === selectedKeys[0]?.toString();
    });
    if (sourceType === SourceType.SOURCE) {
      updateSrcFile(curFile!);
    } else {
      updateDstFile(curFile!);
    }
  };

  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
  };

  useEffect(() => {
    setExpandedKeys(
      treeData.map((node) => {
        return node.key;
      })
    );
  }, [JSON.stringify(treeData)]);

  return (
    <DirectoryTree
      showLine={true}
      onSelect={onSelect}
      onExpand={onExpand}
      motion={{ delay: 0, duration: 0.3 }}
      expandedKeys={expandedKeys}
      treeData={treeData}
    />
  );
};
