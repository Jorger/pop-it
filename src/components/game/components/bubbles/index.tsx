import { Bubble } from "..";
import { IBubble, IMatrix } from "../../../../interfaces";
import { validateIsSelected } from "./helpers";
import React from "react";

interface BubblesProps {
  bubbles: IBubble[][];
  selectBubbles: IMatrix[];
  onClick: (position: IMatrix) => void;
}

const Bubbles = ({ bubbles, selectBubbles, onClick }: BubblesProps) => (
  <React.Fragment>
    {bubbles.map((data) =>
      data.map((bubbleProps) => {
        const isSelected = validateIsSelected(
          selectBubbles,
          bubbleProps.position
        );

        return (
          <Bubble
            {...bubbleProps}
            key={`${bubbleProps.position.row}-${bubbleProps.position.col}`}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      })
    )}
  </React.Fragment>
);

export default Bubbles;
