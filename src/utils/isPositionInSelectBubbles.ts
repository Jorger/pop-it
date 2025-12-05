import { cellPositionInRage } from "./indexInRange";
import type { IMatrix } from "../interfaces";

/**
 * Devuelve el índice donde se encuentra una posición...
 * @param position
 * @param selectedBubles
 * @returns
 */
export const getIndexInSelectBubbles = (
  position: IMatrix,
  selectedBubles: IMatrix[]
) =>
  selectedBubles.findIndex(
    (v) => v.row === position.row && v.col === position.col
  );

/**
 * Valida si una posición dada está en el listado de burbujas seleccioadas
 * @param position
 * @param selectedBubles
 * @returns
 */
export const isPositionInSelectBubbles = (
  position: IMatrix,
  selectedBubles: IMatrix[]
) => getIndexInSelectBubbles(position, selectedBubles) >= 0;

/**
 * Valida si una posisción dada es valida, por que se encuentra
 * en rango y además está dentro de listado de burbujas seleccionadas...
 * @param position
 * @param selectedBubles
 * @returns
 */
export const isValidPosition = (position: IMatrix, selectedBubles: IMatrix[]) =>
  cellPositionInRage(position) &&
  isPositionInSelectBubbles(position, selectedBubles);
