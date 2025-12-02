import { EBoardColor, EBubbleColors } from "../utils/constants";

export type TBoardColor = keyof typeof EBoardColor;
export type TBubbleColors = keyof typeof EBubbleColors;
export type IBackgroud = TBoardColor | "INITIAL";

export interface IMatrix {
  row: number;
  col: number;
}

export interface IBubble {
  color: TBubbleColors;
  isSelected: boolean;
  isPop: boolean;
  isDisabled: boolean;
}
