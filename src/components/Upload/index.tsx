import { InboxOutlined } from "@ant-design/icons";
import { Upload as ADUpload } from "antd";

import { SourceType } from "@/enum";
import { useDirectoryStore, useFileStore } from "@/store";

import type { UploadChangeParam, UploadProps } from "antd/es/upload";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import type { UploadType } from "@/type";

const { Dragger } = ADUpload;

export const Upload = (
  props: UploadProps & {
    displayType: UploadType;
    sourceType: SourceType;
    uploadText: string;
    uploadHint: string;
    shouldDisplayUpload: boolean;
    setShouldDisplayUpload: React.Dispatch<React.SetStateAction<boolean>>;
  }
) => {
  const {
    displayType,
    sourceType,
    uploadHint,
    uploadText,
    shouldDisplayUpload,
    setShouldDisplayUpload,
  } = props;
  const [updateSrcFile, updateDstFile] = useFileStore((state) => [
    state.updateSrcFile,
    state.updateDstFile,
  ]);
  const [srcFileList, dstFileList, updateSrcFileList, updateDstFileList] =
    useDirectoryStore((state) => [
      state.srcFileList,
      state.dstFileList,
      state.updateSrcFileList,
      state.updateDstFileList,
    ]);
  const customRequest = (options: UploadRequestOption) => {
    const { onSuccess } = options;
    onSuccess?.("上传成功");
  };

  const onUploadChange: (info: UploadChangeParam) => void = ({
    file,
    fileList,
  }) => {
    const { originFileObj } = file;

    if (originFileObj) {
      if (displayType === "file") {
        //  只支持上传文件时
        if (sourceType === SourceType.SOURCE) updateSrcFile(file);
        else updateDstFile(file);
      } else if (displayType === "directory") {
        setShouldDisplayUpload(!shouldDisplayUpload);
        if (sourceType === SourceType.SOURCE) updateSrcFileList(fileList);
        else updateDstFileList(fileList);
      }
    }
  };

  return displayType !== "directory" ? (
    <Dragger
      action="localhost:/"
      onChange={onUploadChange}
      customRequest={customRequest}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{uploadText}</p>
      <p className="ant-upload-hint">{uploadHint}</p>
    </Dragger>
  ) : (
    <Dragger
      action="localhost:/"
      onChange={onUploadChange}
      customRequest={customRequest}
      fileList={sourceType === SourceType.SOURCE ? srcFileList : dstFileList}
      multiple={true}
      directory={true}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{uploadText}</p>
      <p className="ant-upload-hint">{uploadHint}</p>
    </Dragger>
  );
};
