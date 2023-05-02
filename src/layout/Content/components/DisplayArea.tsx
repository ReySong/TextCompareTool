import { useEffect, useState } from "react";
import { Input as ADInput, message as ADMessage } from "antd";

import { renderDiffStr } from "@/utils";
import { useFileStore } from "@/store";

import type { UploadType } from "@/type";

const { TextArea } = ADInput;

export const DisplayArea = (props: { displayType: UploadType }) => {
  const { displayType } = props;
  const [src, setSrc] = useState("");
  const [dst, setDst] = useState("");
  const [onlineDiff, setOnlineDiff] = useState<JSX.Element | JSX.Element[]>();
  const [diffStrFromFile, setDiffStrFromFile] = useState<
    JSX.Element | JSX.Element[]
  >();

  const [srcFile, dstFile] = useFileStore((state) => [
    state.srcFile,
    state.dstFile,
  ]);

  useEffect(() => {
    const getFileContents = async (fileArr: (File | undefined)[]) => {
      return Promise.all(
        fileArr.map((file) => {
          const reader = new FileReader();
          try {
            return new Promise<string>((resolve) => {
              file && reader.readAsText(file);
              reader.onload = function () {
                resolve(this.result?.toString() || "");
              };
            });
          } catch (e: any) {
            ADMessage.error(e.message);
            return "";
          }
        })
      );
    };

    getFileContents([srcFile?.originFileObj, dstFile?.originFileObj]).then(
      ([srcFileContent, dstFileContent]) => {
        console.log("srcFileContent:", srcFileContent);
        console.log("dstFileContent:", dstFileContent);
        setDiffStrFromFile(renderDiffStr(srcFileContent, dstFileContent));
      }
    );
  }, [srcFile, dstFile]);

  const genOnlineDiffStr = (src: string, dst: string) => {
    setOnlineDiff(renderDiffStr(src, dst));
  };

  return displayType === "text" ? (
    <div>
      <TextArea
        style={{ marginBottom: "10px" }}
        placeholder="请输入源文本"
        onChange={(e) => {
          setSrc(e.target.value);
          genOnlineDiffStr(e.target.value, dst);
        }}
      />
      <TextArea
        placeholder="请输入目标文本"
        onChange={(e) => {
          setDst(e.target.value);
          genOnlineDiffStr(src, e.target.value);
        }}
      />
      <p>{onlineDiff}</p>
    </div>
  ) : (
    <p style={{ height: "100%" }}>{diffStrFromFile}</p>
  );
};
