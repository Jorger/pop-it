import { IUInteractions } from "../interfaces";

export const BASE_WIDTH = 412;
export const BASE_HEIGHT = 732;
export const BASE_CLASS_NAME_GAME = "game";
export const SIZE_GRID = Math.round(BASE_WIDTH * 0.89);
export const GAP_GRID = 5;
export const TOTAL_CELLS = 6;
export const TOTAL_CELLS_GRID = 6 ** 2;
export const SIZE_CELL = Math.ceil(SIZE_GRID / TOTAL_CELLS);

export enum EBoardColor {
  BLUE = "BLUE",
  RED = "RED",
}

export enum EBubbleColors {
  PURPLE = "PURPLE",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  RED = "RED",
}

export const JS_CSS_VARIABLES: Record<string, number> = {
  BASE_WIDTH,
  BASE_HEIGHT,
  SIZE_GRID,
  GAP_GRID,
  SIZE_CELL,
};

export enum GAME_ACTION_NAME {
  StateSync = "stateSync",
  OnSelectBubble = "onSelectBubble",
  onNextTurn = "onNextTurn",
}

export const INITIAL_UI_INTERACTIONS: IUInteractions = {
  showCounter: true,
  disableUI: false,
  startTimer: false,
  waitEffect: false,
  isGameOver: false,
};
