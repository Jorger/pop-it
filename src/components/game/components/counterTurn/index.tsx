import "./styles.css";
import { getUserAvatar } from "./helpers";
import { PlayerId } from "rune-sdk";
import { useInterval } from "../../../../hooks";
import {
  BASE_CLASS_NAME_GAME,
  TIME_INTERVAL_CHRONOMETER,
} from "../../../../utils/constants";
import React, { useEffect, useState } from "react";
import type { Player } from "../../../../interfaces";

const BASE_CLASS_NAME = `${BASE_CLASS_NAME_GAME}-counter-turn`;

const CLASS_NAMES = {
  WRAPPER: BASE_CLASS_NAME,
  PROFILE: `${BASE_CLASS_NAME}-profile`,
  AVATAR: `${BASE_CLASS_NAME}-avatar`,
  VISIBLE_AVATAR: `${BASE_CLASS_NAME}-avatar-visible`,
};

interface CounterTurnProps {
  startTimer: boolean;
  players: Player[];
  turnID: PlayerId;
  handleInterval: () => void;
}

const CSS_VARIABLE_PROGRESS = "--progress";
const PROGRESS_COMPLETE = 100;

const CounterTurn = ({
  startTimer = false,
  players = [],
  turnID = "",
  handleInterval,
}: CounterTurnProps) => {
  /**
   * Para la información del avatar...
   */
  const userAvatar = getUserAvatar(players);

  /**
   * Para el cronometro que muestra cuanto tiempo le queda para hacer su lanzamiento...
   */
  const [countdown, setCountdown] = useState({
    progress: 0,
    isRunning: false,
  });

  /**
   * Eefecto que se ejcuta cuando desde el padre se indica que
   * se debe reiniciar el contador...
   */
  useEffect(
    () =>
      setCountdown({
        isRunning: startTimer,
        progress: 0,
      }),
    [startTimer]
  );

  useInterval(
    () => {
      const newProgress = countdown.progress + 1;
      setCountdown({ ...countdown, progress: newProgress });

      /**
       * Si el progreso es de 100, quiere decir que ha terminado el couter...
       */
      if (newProgress === PROGRESS_COMPLETE) {
        /**
         * Se detiene el counter...
         */
        setCountdown({ ...countdown, isRunning: false });

        /**
         * Se Indica al componente padre que el tiempo ha terminado...
         */
        handleInterval();
      }
    },
    countdown.isRunning ? TIME_INTERVAL_CHRONOMETER : null
  );

  /**
   * Estilo que se muestra para el cronometro
   */
  const styleCountdown = {
    [CSS_VARIABLE_PROGRESS]: `${Math.round(360 * (countdown.progress / 100))}deg`,
  } as React.CSSProperties;

  return (
    <div className={CLASS_NAMES.WRAPPER} style={styleCountdown}>
      <div className={CLASS_NAMES.PROFILE}>
        {Object.keys(userAvatar).map((id) => {
          const isVisible = id === turnID;

          return (
            <img
              className={`${CLASS_NAMES.AVATAR} ${isVisible ? CLASS_NAMES.VISIBLE_AVATAR : ""}`}
              src={userAvatar[id]}
              alt="image"
              key={id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CounterTurn);
