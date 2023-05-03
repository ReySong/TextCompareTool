import { InboxOutlined } from "@ant-design/icons";
import { Upload as ADUpload } from "antd";

import { SourceType } from "@/enum";
import { useDirectoryStore, useFileStore, useTreeStore } from "@/store";

import type {
  UploadChangeParam,
  UploadProps,
  UploadFile,
} from "antd/es/upload";
import type { DataNode as ADDataNode } from "antd/es/tree";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import type { UploadType } from "@/type";
import { fileListMinus } from "@/utils";
import { useEffect, useState } from "react";

const { Dragger } = ADUpload;

export const Upload = (
  props: UploadProps & {
    displayType: UploadType;
    sourceType: SourceType;
    uploadText: string;
    uploadHint: string;
    setShouldDisplayUpload: React.Dispatch<React.SetStateAction<boolean>>;
  }
) => {
  const {
    displayType,
    sourceType,
    uploadHint,
    uploadText,
    setShouldDisplayUpload,
  } = props;
  const [newFileList, setNewFileList] = useState<UploadFile[]>([]);
  const [srcFile, dstFile, updateSrcFile, updateDstFile, removeAllFiles] =
    useFileStore((state) => [
      state.srcFile,
      state.dstFile,
      state.updateSrcFile,
      state.updateDstFile,
      state.removeAllFiles,
    ]);
  const [srcFileList, dstFileList, updateSrcFileList, updateDstFileList] =
    useDirectoryStore((state) => [
      state.srcFileList,
      state.dstFileList,
      state.updateSrcFileList,
      state.updateDstFileList,
    ]);

  const [updateSrcTreeData, updateDstTreeData] = useTreeStore((state) => [
    state.updateSrcTreeData,
    state.updateDstTreeData,
  ]);

  const transferFileListToTreeNode = (fileList: UploadFile[]) => {
    const treeData = [] as ADDataNode[];
    fileList.forEach((file) => {
      const path = file?.originFileObj?.webkitRelativePath?.split("/") || [];
      let curLevelTreeData = treeData;
      path.forEach((part, index) => {
        const isLeafNode = index === path.length - 1;
        const existingNode = curLevelTreeData.find(
          (item) => item.title === part
        );
        if (existingNode) {
          curLevelTreeData = existingNode.children as ADDataNode[];
        } else {
          const newNode = {
            title: part,
            key: isLeafNode ? file.uid : part,
            selectable: isLeafNode,
            isLeaf: isLeafNode,
            children: [],
          } as ADDataNode;
          curLevelTreeData.push(newNode);
          curLevelTreeData = newNode.children as ADDataNode[];
        }
      });
    });
    return treeData;
  };

  const customRequest = (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    if (file) onSuccess?.("上传成功");
    else onError?.(new Error("上传失败"));
  };

  const onBeforeUpload = () => {
    removeAllFiles();
  };

  const onUploadChange: (info: UploadChangeParam) => void = ({
    file,
    fileList,
  }) => {
    const { originFileObj } = file;

    //  仅用于上传单个文件时判断
    const isRemoveWhenFile = fileList.length === 0;

    let isRemoveWhenDirectory = false;
    if (sourceType === SourceType.SOURCE)
      isRemoveWhenDirectory = srcFileList.length > newFileList.length;
    else isRemoveWhenDirectory = dstFileList.length > newFileList.length;

    if (originFileObj) {
      if (displayType === "file") {
        if (isRemoveWhenFile) return;
        if (sourceType === SourceType.SOURCE) updateSrcFile(file);
        else updateDstFile(file);
      } else if (displayType === "directory") {
        setNewFileList(fileList);
        if (!isRemoveWhenDirectory) setShouldDisplayUpload(false);
      }
    }
  };

  const onUploadRemove = (file: UploadFile) => {
    if (sourceType === SourceType.SOURCE) {
      if (file.uid === srcFile?.uid) updateSrcFile(null);
    } else {
      if (file.uid === dstFile?.uid) updateDstFile(null);
    }
  };

  useEffect(() => {
    if (!newFileList.length) return;
    if (sourceType === SourceType.SOURCE) {
      const res = fileListMinus(newFileList, srcFileList);
      updateSrcFileList(res);
      updateSrcTreeData(transferFileListToTreeNode(res));
    } else {
      const res = fileListMinus(newFileList, dstFileList);
      updateDstFileList(res);
      updateDstTreeData(transferFileListToTreeNode(res));
    }
    setNewFileList(newFileList);
  }, [JSON.stringify(newFileList)]);

  return displayType === "file" ? (
    <Dragger
      maxCount={1}
      beforeUpload={onBeforeUpload}
      onChange={onUploadChange}
      onRemove={onUploadRemove}
      customRequest={customRequest}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{uploadText}</p>
      <p className="ant-upload-hint">{uploadHint}</p>
    </Dragger>
  ) : (
    <Dragger
      beforeUpload={onBeforeUpload}
      onChange={onUploadChange}
      onRemove={onUploadRemove}
      customRequest={customRequest}
      fileList={sourceType === SourceType.SOURCE ? srcFileList : dstFileList}
      directory={true}
      showUploadList={false}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{uploadText}</p>
      <p className="ant-upload-hint">{uploadHint}</p>
    </Dragger>
  );
};
