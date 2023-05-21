import { myersDiff } from "./core/myers-diff";

import { Divider as ADDivider } from "antd";

import type { UploadFile } from "antd";
import type { DiffInfo, Mode } from "./type";

export function renderDiffStr(diffInfo: DiffInfo[], mode: Mode = "char") {
  const diffStr = diffInfo?.map(({ color, str }, i) => {
    return (
      <span key={i}>
        {mode === "char" ? null : (
          <>
            <span>{i + 1}</span>
            <ADDivider type="vertical" dashed />
          </>
        )}
        <span style={{ color }}>{mode === "char" ? str : `${str}\n`}</span>
      </span>
    );
  });
  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {diffStr?.length ? diffStr : ""}
    </div>
  );
}

//  由于上传文件夹时，每一个文件都会触发一次 onChange，但是清除上次上传的文件只需要清除一次，所以设置一个缓存
let minusCache = {} as any;
export const fileListMinus = (
  subtrahendFileList: UploadFile[] | undefined,
  minuendFileList: UploadFile[] | undefined
) => {
  if (!subtrahendFileList) return [];
  if (!minuendFileList) return subtrahendFileList;
  const cache =
    minusCache[
      subtrahendFileList
        .map((file) => {
          return file.uid;
        })
        .join(",")
    ];
  if (cache) return cache;
  //  下一次文件夹上传时将缓存清除
  else minusCache = {};

  const res = [] as UploadFile[];
  for (let subtrahendFile of subtrahendFileList) {
    const index = minuendFileList.findIndex(
      (minuendFile) => subtrahendFile.uid === minuendFile.uid
    );
    if (index > -1) {
      minuendFileList.splice(index, 1);
    } else {
      res.push(subtrahendFile);
    }
  }
  minusCache[
    subtrahendFileList
      .map((file) => {
        return file.uid;
      })
      .join(",")
  ] = res;
  return res;
};
