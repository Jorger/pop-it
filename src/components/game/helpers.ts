import { PlayerId } from "rune-sdk";
import type { IBackgroud, IBubble, IMatrix, Player } from "../../interfaces";
import { cellPositionInRage } from "../../utils/indexInRange";

/**
 * Obtener la información del jugador por id
 * @param id
 * @param players
 * @returns
 */
export const getPlayerByID = (id: PlayerId, players: Player[]) =>
  players.find((v) => v.playerID === id);

/**
 * Se obtiene el color del player que tiene el turno...
 * @param id
 * @param players
 * @returns
 */
export const getCurrentColor = (turnID: PlayerId, players: Player[]) => {
  let currentColor: IBackgroud = "INITIAL";

  /**
   * Se obtiene el jugado atual..
   */
  const currentPlayer = getPlayerByID(turnID, players);

  if (currentPlayer) {
    currentColor = currentPlayer.color;
  }

  return currentColor;
};

interface ValidateSelectBubble {
  selectedBubles: IMatrix[];
  position: IMatrix;
  selectRow: number;
  bubbles: IBubble[][];
}

export const validateSelectBubble = ({
  selectedBubles,
  position,
  selectRow,
  bubbles,
}: ValidateSelectBubble) => {
  /**
   * Para saber si ya tenía burbujas seleccionadas...
   */
  const hasSelectedBubbles = selectedBubles.length !== 0;

  /**
   * Posición inválida...
   */
  if (!cellPositionInRage(position)) return;

  /**
   * Validar que esté en la misma fila, si es que tenía burbijas seleccionadas...
   */
  if (hasSelectedBubbles && position.row !== selectRow) return;

  /**
   * No tiene burbujas seleccionadas por tanto puede emitir...
   */
  if (!hasSelectedBubbles) {
    return Rune.actions.onSelectBubble(position);
  }

  /**
   * Si busca el índice de la burbuja seleccioanad en el listado de
   * burbujas que estaban, puede ser que no exista...
   */
  const indexSelectedBubble = selectedBubles.findIndex(
    (v) => v.row === position.row && v.col === position.col
  );

  /**
   * Para saber si se está deseleccionando una burbuja ya existente...
   */
  const isDeselectedBubble = indexSelectedBubble >= 0;

  /**
   * Para buscar la columna anterior y siguiente...
   */
  const previousColPosition: IMatrix = {
    row: position.row,
    col: position.col - 1,
  };

  const nextColPosition: IMatrix = {
    row: position.row,
    col: position.col + 1,
  };

  const isPreviousInRange = cellPositionInRage(previousColPosition);
  const isNextInRange = cellPositionInRage(nextColPosition);

  console.log({
    selectedBubles,
    position,
    selectRow,
    hasSelectedBubbles,
    previousColPosition,
    nextColPosition,
    isPreviousInRange,
    isNextInRange,
  });

  /**
   * Para saber si se emite al servidor la posición...
   */
  let serverEmit = false;

  if (isDeselectedBubble) {
    let isEnabledPrevious = true;
    let isEnabledNext = true;

    if (isPreviousInRange) {
      isEnabledPrevious =
        !bubbles[previousColPosition.row][previousColPosition.col].isPop;
    }

    if (isNextInRange) {
      isEnabledNext = !bubbles[nextColPosition.row][nextColPosition.col].isPop;
    }

    serverEmit = isEnabledPrevious || isEnabledNext;
  } else {
    let isEmptyPrevious = false;
    let isEmptyNext = false;

    if (isPreviousInRange) {
      isEmptyPrevious =
        bubbles[previousColPosition.row][previousColPosition.col].isPop;
    }

    if (isNextInRange) {
      isEmptyNext = bubbles[nextColPosition.row][nextColPosition.col].isPop;
    }

    serverEmit = isEmptyPrevious || isEmptyNext;
  }

  if (serverEmit) {
    Rune.actions.onSelectBubble(position);
  }
};
