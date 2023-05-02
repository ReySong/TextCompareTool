import type { VK, VD, DiffInfo, Snake, Mode } from "@/type";

export function myersDiff(src: string, dst: string, mode: Mode = "char") {
  if (mode === "char") {
    const n = src.length,
      m = dst.length;
    let d: number, k: number;
    //  记录每一个 k 能够到达的最远 x 值
    const vk = {
      "1": 0,
    } as VK;
    //  记录 d 步长所有 k 能够到达的最远 x 值
    const vd = {
      "0": { "1": 0 },
    } as VD;
    for (d = 0; d <= n + m; ++d) {
      let x: number, y: number;
      const vTmp = {} as VK;
      for (k = -d; k <= d; k += 2) {
        if (k === -d || (k !== d && vk[k - 1] < vk[k + 1])) x = vk[k + 1];
        else x = vk[k - 1] + 1;
        y = x - k;
        while (x < n && y < m && src[x] === dst[y]) {
          ++x;
          ++y;
        }
        vk[k] = x;
        vTmp[k] = x;
        if (x === n && y === m) {
          vd[d] = vTmp;
          return genDiffStr(genSnakes(vd, n, m, d), src, dst);
        }
      }
      vd[d] = vTmp;
    }
    return genDiffStr(genSnakes(vd, n, m, d), src, dst);
  } else if (mode === "line") {
    const n = src.length,
      m = dst.length;
    let d: number, k: number;
    //  记录每一个 k 能够到达的最远 x 值
    const vk = {
      "1": 0,
    } as VK;
    //  记录 d 步长所有 k 能够到达的最远 x 值
    const vd = {
      "0": { "1": 0 },
    } as VD;
    for (d = 0; d <= n + m; ++d) {
      let x: number, y: number;
      const vTmp = {} as VK;
      for (k = -d; k <= d; k += 2) {
        if (k === -d || (k !== d && vk[k - 1] < vk[k + 1])) x = vk[k + 1];
        else x = vk[k - 1] + 1;
        y = x - k;
        while (x < n && y < m && src[x] === dst[y]) {
          ++x;
          ++y;
        }
        vk[k] = x;
        vTmp[k] = x;
        if (x === n && y === m) {
          vd[d] = vTmp;
          return genDiffStr(genSnakes(vd, n, m, d), src, dst);
        }
      }
      vd[d] = vTmp;
    }
    return genDiffStr(genSnakes(vd, n, m, d), src, dst);
  }
}

function genSnakes(vd: VD, n: number, m: number, d: number) {
  const snakes = [] as Snake[];
  const p = { x: n, y: m };

  for (; d > 0; --d) {
    const vk = vd[d];
    const vPrev = vd[d - 1];
    const k = p.x - p.y;

    const xCur = vk[k];

    const down = k == -d || (k != d && vPrev[k + 1] > vPrev[k - 1]);
    const kPrev = down ? k + 1 : k - 1;
    const xPrev = vPrev[kPrev];
    const yPrev = xPrev - kPrev;
    const xMid = down ? xPrev : xPrev + 1;

    snakes.unshift({ xPrev, xMid, xCur });

    p.x = xPrev;
    p.y = yPrev;
  }

  return snakes;
}

function genDiffStr(snakes: Snake[], src: string, dst: string) {
  const res = [] as DiffInfo[];
  let resItem: DiffInfo = { color: "black", str: "" };
  let yOffset = 0;

  snakes.forEach(({ xPrev, xMid, xCur }, index) => {
    if (index === 0 && xPrev !== 0) {
      resItem.color = "black";
      resItem.str = src.slice(0, xPrev);
      yOffset += xPrev;
      res.push(JSON.parse(JSON.stringify(resItem)));
    }

    if (xMid - xPrev === 1) {
      resItem.color = "red";
      resItem.str = src[xPrev];
      res.push(JSON.parse(JSON.stringify(resItem)));
    } else {
      resItem.color = "green";
      resItem.str = dst[yOffset];
      res.push(JSON.parse(JSON.stringify(resItem)));
      yOffset++;
    }

    resItem.color = "black";
    resItem.str = "";
    for (let i = 0; i < xCur - xMid; i++) {
      resItem.str += src[xMid + i];
      yOffset++;
    }
    res.push(JSON.parse(JSON.stringify(resItem)));
  });
  return res;
}
