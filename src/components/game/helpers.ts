import { cellPositionInRage } from "../../utils/indexInRange";
import { PlayerId } from "rune-sdk";
import { randomNumber } from "../../utils/randomNumber";
import {
  isPositionInSelectBubbles,
  isValidPosition,
} from "../../utils/isPositionInSelectBubbles";
import cloneDeep from "lodash.clonedeep";
import type {
  IBackgroud,
  IBubble,
  IMatrix,
  IUInteractions,
  Player,
  TInvalidPop,
  TKeyPosition,
} from "../../interfaces";

/**
 * Devuelve el listado de burbujas vacías...
 * @param bubbles
 */
const getEmptyBubbles = (bubbles: IBubble[][]) => {
  const emptyBubbles: IMatrix[] = [];

  for (const row of bubbles) {
    for (const bubble of row) {
      if (!bubble.isPop && !bubble.isDisabled) {
        emptyBubbles.push(bubble.position);
      }
    }
  }

  return emptyBubbles;
};

/**
 * Actualiza la información cuando una burbuja es marcada como invalida...
 * @param invalidPop
 * @param position
 * @returns
 */
const updateInvalidPop = (invalidPop: TInvalidPop, position: IMatrix) => {
  let copyCurrent = cloneDeep(invalidPop);
  const keyPosition: TKeyPosition = `${position.row}-${position.col}`;

  if (!copyCurrent) {
    copyCurrent = {};
  }

  /**
   * Si no existe se crea el valor, en este caso el número
   * es usado en el key del compoennte Bubble, para así
   * forzar el re-renderizado del mismo...
   */
  if (!copyCurrent[keyPosition]) {
    copyCurrent[keyPosition] = 1;
  } else {
    copyCurrent[keyPosition]++;
  }

  return copyCurrent;
};

/**
 * Establece que el UI estará bloqueado en el cliente....
 * @param setUiInteractions
 */
export const setDisabledUI = (
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>
) => {
  setUiInteractions((current) => {
    return {
      ...current,
      disableUI: true,
      startTimer: false,
      waitEffect: false,
    };
  });
};

/**
 * Para validar el siguiente turno, además bloquea el UI...
 * @param setUiInteractions
 */
export const validateNextTurn = (
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>
) => {
  /**
   * Bloquea la UI...
   */
  setDisabledUI(setUiInteractions);

  // Emite al server
  Rune.actions.onNextTurn();
};

interface GetRandomBubble {
  selectedBubles: IMatrix[];
  bubbles: IBubble[][];
  setUiInteractions: React.Dispatch<React.SetStateAction<IUInteractions>>;
}

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
  setInvalidPop: React.Dispatch<React.SetStateAction<TInvalidPop>>;
}

/**
 * Valida la selección de una burbuja...
 * @param param0
 * @returns
 */
export const validateSelectBubble = ({
  selectedBubles,
  position,
  selectRow,
  bubbles,
  setInvalidPop,
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
    return Rune.actions.onSelectBubble({ position, isAuto: false });
  }

  /**
   * Para saber si se está deseleccionando una burbuja ya existente...
   */
  const isDeselectedBubble = isPositionInSelectBubbles(
    position,
    selectedBubles
  );

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

  /**
   * Valida si la posición dada está en rango y además
   * está dentro del listado de burbujas seleccionadas...
   */
  const isPreviousInRange = isValidPosition(
    previousColPosition,
    selectedBubles
  );

  const isNextInRange = isValidPosition(nextColPosition, selectedBubles);

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
    Rune.actions.onSelectBubble({ position, isAuto: false });
  } else {
    /**
     * Se muestra un estado que indica que no es válido el pop...
     */
    setInvalidPop((current) => updateInvalidPop(current, position));
  }
};

/**
 * Para hacer un lanzamiento aleatorio, cuando el tiempo del
 * turno se ha pasado...
 * @param param0
 * @returns
 */
export const getRandomBubble = ({
  selectedBubles,
  bubbles,
  setUiInteractions,
}: GetRandomBubble) => {
  /**
   * Para saber si ya tenía burbujas seleccionadas...
   */
  const hasSelectedBubbles = selectedBubles.length !== 0;

  /**
   * Ya tenía burbujas seleccioandas, así que se emite la acción
   * de next turn
   */
  if (hasSelectedBubbles) {
    return validateNextTurn(setUiInteractions);
  }

  /**
   * En esta parte es que no se ha seleccionado burbujas, así que
   * se genera de forma aletoria...
   */

  /**
   * Se obtiene el listado de burbujas que están vacías...
   */
  const emptyBubbles = getEmptyBubbles(bubbles);

  /**
   * Si no hay burbujas vacias, no se hace nada...
   */
  if (emptyBubbles.length === 0) return;

  /**
   * Ahora se obtiene una burbuja aleatoria...
   */
  const randomIndex = randomNumber(0, emptyBubbles.length - 1);

  /**
   * La posición aleatorio de la burbuja...
   */
  const randomPosition = emptyBubbles[randomIndex];

  /**
   * Por si la posición obtenida no es válida...
   */
  if (!cellPositionInRage(randomPosition)) return;

  /**
   * Se bloquea la UI
   */
  setDisabledUI(setUiInteractions);

  /**
   * Si todo sale bien, se emite cambio al server...
   */
  Rune.actions.onSelectBubble({ position: randomPosition, isAuto: true });
};
