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
  const [innerFileList, setInnerFileList] = useState<UploadFile[]>([]);
  const [innerTreeData, setInnderTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [updateSrcFile, updateDstFile] = useFileStore((state) => [
    state.updateSrcFile,
    state.updateDstFile,
  ]);

  const onSelect = (selectedKeys: React.Key[]) => {
    const curFile = innerFileList.find((file) => {
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
    if (fileList.length) {
      setInnerFileList([...fileList]);
    }
  }, [JSON.stringify(fileList)]);

  useEffect(() => {
    if (treeData.length) {
      setInnderTreeData([...treeData]);
      setExpandedKeys(
        treeData.map((node) => {
          return node.key;
        })
      );
    }
  }, [JSON.stringify(treeData)]);

  return (
    <>
      <DirectoryTree
        showLine={true}
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        treeData={innerTreeData}
      />
    </>
  );
};
