import { myersDiff } from "./core/myers-diff";

self.addEventListener("message", (event) => {
  const { data } = event;
  const [srcFileContent, dstFileContent, diffMode] = data;
  const result = myersDiff(srcFileContent, dstFileContent, diffMode);
  self.postMessage(result);
});
