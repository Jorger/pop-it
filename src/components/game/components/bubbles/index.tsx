import { Bubble } from "..";
import { IBubble, IMatrix, TInvalidPop } from "../../../../interfaces";
import { validateIsInvalid, validateIsSelected } from "./helpers";
import React from "react";

interface BubblesProps {
  bubbles: IBubble[][];
  selectBubbles: IMatrix[];
  invalidPop: TInvalidPop;
  onClick: (position: IMatrix) => void;
}

const Bubbles = ({
  bubbles,
  selectBubbles,
  invalidPop,
  onClick,
}: BubblesProps) => (
  <React.Fragment>
    {bubbles.map((data) =>
      data.map((bubbleProps) => {
        const { position } = bubbleProps;
        const isSelected = validateIsSelected(selectBubbles, position);
        const { isInvalid, counter } = validateIsInvalid(invalidPop, position);
        const { row, col } = position;

        /**
         * Si el key cambia, quiere decir que vuelva a "renderizar" el componente...
         */
        const key = `${row}-${col}-${counter}`;

        return (
          <Bubble
            {...bubbleProps}
            key={key}
            isInvalid={isInvalid}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      })
    )}
  </React.Fragment>
);

export default Bubbles;
