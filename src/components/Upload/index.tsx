import { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload as ADUpload } from "antd";

import { SourceType } from "@/enum";
import { fileListMinus } from "@/utils";
import { useDirectoryStore, useFileStore, useTreeStore } from "@/store";

import type {
  UploadChangeParam,
  UploadProps,
  UploadFile,
} from "antd/es/upload";
import type { DataNode as ADDataNode } from "antd/es/tree";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import type { UploadType } from "@/type";

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
  const acceptStr =
    "text/*,.json,.tsx,.d.ts,.ts,.js,.jsx,.yaml,.xml,.md,.css,.less,.sass";
  const [newFileList, setNewFileList] = useState<UploadFile[]>([]);
  const [
    srcFile,
    dstFile,
    updateSrcFile,
    updateDstFile,
    removeSrcFile,
    removeDstFile,
  ] = useFileStore((state) => [
    state.srcFile,
    state.dstFile,
    state.updateSrcFile,
    state.updateDstFile,
    state.removeSrcFile,
    state.removeDstFile,
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
    if (sourceType === SourceType.SOURCE) removeSrcFile();
    else removeDstFile();
  };

  const onUploadChange: (info: UploadChangeParam) => void = ({
    file,
    fileList,
  }) => {
    const { originFileObj } = file;

    //  仅用于文件比较时
    let isRemoveWhenCompareByFile = fileList.length === 0;

    let isRemoveWhenDirectory = false;
    if (sourceType === SourceType.SOURCE)
      isRemoveWhenDirectory = srcFileList.length > newFileList.length;
    else isRemoveWhenDirectory = dstFileList.length > newFileList.length;

    if (originFileObj) {
      if (displayType === "file") {
        if (isRemoveWhenCompareByFile) return;
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
    if (!newFileList?.length) return;
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
      accept={acceptStr}
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
      accept={acceptStr}
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
