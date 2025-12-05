import type {
  IMatrix,
  TInvalidPop,
  TKeyPosition,
} from "../../../../interfaces";

export const validateIsSelected = (
  selectBubbles: IMatrix[],
  position: IMatrix
) => {
  return (
    selectBubbles.findIndex(
      (v) => v.row === position.row && v.col === position.col
    ) >= 0
  );
};

/**
 * Valida si el valor de selección de una burbuja es válido...
 * @param position
 * @param invalidPop
 * @returns
 */
export const validateIsInvalid = (
  invalidPop: TInvalidPop,
  position: IMatrix
) => {
  /**
   * El key para buscar si existe...
   */
  const keyPosition: TKeyPosition = `${position.row}-${position.col}`;

  if (!invalidPop?.[keyPosition]) {
    return { isInvalid: false, counter: 0 };
  }

  return { isInvalid: true, counter: invalidPop[keyPosition] };
};
