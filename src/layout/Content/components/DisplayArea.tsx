import { useEffect, useState } from "react";
import { Input as ADInput, message as ADMessage } from "antd";

import { renderDiffStr } from "@/utils";
import { useFileStore } from "@/store";

import type { UploadType } from "@/type";
import { useDiffModeStore } from "@/store/stores/diffMode";

const { TextArea } = ADInput;

export const DisplayArea = (
  props: { displayType: UploadType } & {
    containerHeight: number;
  }
) => {
  const { containerHeight, displayType } = props;
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

  const [diffMode] = useDiffModeStore((state) => [state.diffMode]);

  useEffect(() => {
    if (displayType === "text") genOnlineDiffStr(src, dst);
    else {
      const getFileContents = async (fileArr: (File | undefined)[]) => {
        return Promise.all(
          fileArr.map((file) => {
            if (!file) return "";
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
          setDiffStrFromFile(
            renderDiffStr(srcFileContent, dstFileContent, diffMode)
          );
        }
      );
    }
  }, [srcFile, dstFile, diffMode]);

  const genOnlineDiffStr = (src: string, dst: string) => {
    setOnlineDiff(renderDiffStr(src, dst, diffMode));
  };

  return displayType === "text" ? (
    <div>
      <TextArea
        style={{ marginBottom: "10px", height: (containerHeight - 40) / 3 }}
        placeholder="请输入源文本"
        onChange={(e) => {
          setSrc(e.target.value);
          genOnlineDiffStr(e.target.value, dst);
        }}
      />
      <TextArea
        style={{ height: (containerHeight - 40) / 3 }}
        placeholder="请输入目标文本"
        onChange={(e) => {
          setDst(e.target.value);
          genOnlineDiffStr(src, e.target.value);
        }}
      />
      <div style={{ marginTop: "10px" }}>{onlineDiff}</div>
    </div>
  ) : (
    <div style={{ height: "100%" }}>{diffStrFromFile}</div>
  );
};
