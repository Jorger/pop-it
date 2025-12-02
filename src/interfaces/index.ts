import { EBoardColor, EBubbleColors } from "../utils/constants";
import { PlayerId, RuneClient } from "rune-sdk";

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

export type TBoardColor = keyof typeof EBoardColor;
export type TBubbleColors = keyof typeof EBubbleColors;
export type IBackgroud = TBoardColor | "INITIAL";

export interface IMatrix {
  row: number;
  col: number;
}

export interface IBubble {
  position: IMatrix;
  color: TBubbleColors;
  isPop: boolean;
  isDisabled: boolean;
}

export interface Player {
  playerID: PlayerId;
  color: TBoardColor;
}

export interface GameState {
  players: Player[];
  turnID: PlayerId;
  isGameOver: boolean;
  isBubblePop: boolean;
  selectBubbles: IMatrix[];
  selectRow: number;
  bubbles: IBubble[][];
}

export type GameActions = {
  onSelectBubble: (position: IMatrix) => void;
  onNextTurn: () => void;
};

export interface IUInteractions {
  /**
   * Muestra el contador inicial del juego...
   */
  showCounter: boolean;
  /**
   * Bloquea el UI hasta que exista una nueva acción...
   */
  disableUI: boolean;
  /**
   * Inicia el tiempo restante para que un jugador haga su movimiento...
   */
  startTimer: boolean;

  /**
   * Valida si activa el efecto para esperar la animación de flip...
   */
  waitEffect: boolean;

  /**
   * Para saber si es el game over...
   */
  isGameOver: boolean;
}
