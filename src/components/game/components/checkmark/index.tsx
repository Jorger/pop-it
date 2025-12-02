import "./styles.css";
import { BASE_CLASS_NAME_GAME } from "../../../../utils/constants";
import checkmark from "../../../../assets/checkmark.svg";
import type { TBoardColor } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-checkmark`;

interface CheckmarkProps {
  color: TBoardColor;
  onClick: () => void;
}

const Checkmark = ({ color, onClick }: CheckmarkProps) => {
  const className = `${BASE_CLASS_NAME} ${color.toLowerCase()}`;

  return (
    <button className={className} onClick={onClick}>
      <img src={checkmark} />
    </button>
  );
};

export default Checkmark;
