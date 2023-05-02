import React, { useMemo, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button as ADButton,
  Divider as ADDivider,
  Radio as ADRadio,
  Typography as ADTypography,
} from "antd";

import { Upload, Tree } from "@/components";
import { useFileStore } from "@/store";
import { SourceType } from "@/enum";

import type { UploadType } from "@/type";

const { Paragraph } = ADTypography;

export const OperateArea = (props: {
  displayType: UploadType;
  setDisplayType: React.Dispatch<React.SetStateAction<UploadType>>;
}) => {
  const { displayType, setDisplayType } = props;
  const [shouldDisplaySrcUpload, setShouldDisplaySrcUpload] = useState(true);
  const [shouldDisplayDstUpload, setShouldDisplayDstUpload] = useState(true);
  const [removeAllFiles] = useFileStore((state) => [state.removeAllFiles]);

  const getDisplay = (name: string) => {
    if (displayType === "text") return "none";
    else if (displayType === "file") {
      return name.includes("Upload") ? "block" : "none";
    } else {
      switch (name) {
        case "srcUpload":
          return shouldDisplaySrcUpload ? "block" : "none";
        case "srcTree":
          return shouldDisplaySrcUpload ? "none" : "block";
        case "dstUpload":
          return shouldDisplayDstUpload ? "block" : "none";
        case "dstTree":
          return shouldDisplayDstUpload ? "none" : "block";
        default:
          return "block";
      }
    }
  };

  const uploadText = useMemo(() => {
    if (displayType === "file") return "请上传文件";
    else if (displayType === "directory") return "请上传文件夹";
    else return "";
  }, [displayType]);
  const uploadHint = useMemo(() => {
    if (displayType === "file")
      return "把文件拖入指定区域，完成上传，同样支持点击上传。";
    else if (displayType === "directory")
      return "把文件夹拖入指定区域，完成上传，同样支持点击上传。";
    else return "";
  }, [displayType]);

  return (
    <div>
      <div>
        <div style={{ marginBottom: "5px" }}>
          <ADRadio.Group
            defaultValue={"text"}
            onChange={(e) => {
              removeAllFiles();
              setDisplayType(() => e.target?.value);
            }}>
            <ADRadio.Button value={"text"}>在线文本比较</ADRadio.Button>
            <ADRadio.Button value={"file"}>上传文件比较</ADRadio.Button>
            <ADRadio.Button value={"directory"}>上传文件夹比较</ADRadio.Button>
          </ADRadio.Group>
        </div>

        {displayType === "text" ? (
          <ADTypography>
            <Paragraph>
              请在右侧文本框中输入源文本与目标文本，系统会自动完成比对，生成差异信息
            </Paragraph>
            <Paragraph>
              <span style={{ color: "red" }}>红色</span>
              字体为负差异，即需要删除地文本。
            </Paragraph>
            <Paragraph>
              <span style={{ color: "green" }}>绿色</span>
              字体为正差异，即需要新增地文本。
            </Paragraph>
          </ADTypography>
        ) : (
          <div>
            <div style={{ display: getDisplay("srcUpload") }}>
              <span>
                {(() => {
                  if (displayType === "file") return "源文件：";
                  else return "源文件夹：";
                })()}
              </span>
              <Upload
                style={{
                  marginBottom: "5px",
                }}
                sourceType={SourceType.SOURCE}
                displayType={displayType}
                uploadHint={uploadHint}
                uploadText={uploadText}
                shouldDisplayUpload={shouldDisplaySrcUpload}
                setShouldDisplayUpload={setShouldDisplaySrcUpload}
                directory={displayType === "directory"}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">{uploadText}</p>
                <p className="ant-upload-hint">{uploadHint}</p>
              </Upload>
            </div>
            <div style={{ display: getDisplay("srcTree") }}>
              <ADButton
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={() => {
                  setShouldDisplaySrcUpload((state) => !state);
                }}>
                重新上传源文件夹
              </ADButton>
              <Tree sourceType={SourceType.SOURCE} />
              <ADDivider />
            </div>

            <div style={{ display: getDisplay("dstUpload") }}>
              <span>
                {(() => {
                  if (displayType === "file") return "目标文件：";
                  else return "目标文件夹：";
                })()}
              </span>
              <Upload
                sourceType={SourceType.DESTINATION}
                displayType={displayType}
                uploadHint={uploadHint}
                uploadText={uploadText}
                shouldDisplayUpload={shouldDisplayDstUpload}
                setShouldDisplayUpload={setShouldDisplayDstUpload}
                directory={displayType === "directory"}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">{uploadText}</p>
                <p className="ant-upload-hint">{uploadHint}</p>
              </Upload>
            </div>
            <div style={{ display: getDisplay("dstTree") }}>
              <ADButton
                style={{
                  marginBottom: "5px",
                }}
                onClick={() => {
                  setShouldDisplayDstUpload((state) => !state);
                }}>
                重新上传目标文件夹
              </ADButton>
              <Tree sourceType={SourceType.DESTINATION} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
