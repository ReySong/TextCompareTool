import { message } from "antd";

import { myersDiff } from "./core/myers-diff";

export const renderDiffStr = (src: string, dst: string) => {
  const diffInfo = myersDiff(src, dst);
  const diffStr = diffInfo.map(({ color, str }, i) => {
    return (
      <span key={i} style={{ color }}>
        {str}
      </span>
    );
  });
  return diffStr.length ? diffStr : <span>{src}</span>;
};
