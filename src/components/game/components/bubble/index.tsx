import "./styles.css";
import { BASE_CLASS_NAME_GAME } from "../../../../utils/constants";
import type { IBubble, IMatrix } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-bubble`;

const CLASS_NAMES = {
  WRAPPER: BASE_CLASS_NAME,
  SELECTED: `${BASE_CLASS_NAME}-selected`,
  POP: `${BASE_CLASS_NAME}-pop`,
};

interface BubbleProps extends IBubble {
  isSelected: boolean;
  onClick: (position: IMatrix) => void;
}

const Bubble = ({
  color,
  position,
  isSelected,
  isDisabled,
  isPop,
  onClick,
}: BubbleProps) => {
  const className = `${CLASS_NAMES.WRAPPER} ${color.toLowerCase()} ${
    isSelected ? CLASS_NAMES.SELECTED : ""
  } ${isPop ? CLASS_NAMES.POP : ""}`;

  return (
    <button
      disabled={isDisabled}
      className={className}
      onClick={() => onClick(position)}
    />
  );
};

export default Bubble;
