export interface VK {
  [key: string]: number;
}

export interface VD {
  [key: string]: VK;
}

export interface Snake {
  xPrev: number;
  xMid: number;
  xCur: number;
}

export interface DiffInfo {
  color: string;
  str: string;
}

export type Mode = "char" | "line";

export type UploadType = "text" | "file" | "directory";
