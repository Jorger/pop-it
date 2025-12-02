import type { IMatrix } from "../../../../interfaces";

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
