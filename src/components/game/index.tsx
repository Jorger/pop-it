import { PlayerId } from "rune-sdk";
import { useCallback, useEffect, useState } from "react";
import { useWait } from "../../hooks";
import {
  Bubbles,
  Checkmark,
  CounterTurn,
  GameWrapper,
  Grid,
  OpponentThinks,
  ShowTurn,
  StartCounter,
} from "./components";
import {
  DELAY_START_TIMER,
  GAME_ACTION_NAME,
  INITIAL_UI_INTERACTIONS,
} from "../../utils/constants";
import {
  getCurrentColor,
  getRandomBubble,
  validateNextTurn,
  validateSelectBubble,
} from "./helpers";
import type {
  GameState,
  IMatrix,
  IUInteractions,
  TBoardColor,
  TInvalidPop,
} from "../../interfaces";

/**
 * Componente principal del juego..
 * @returns
 */
const Game = () => {
  /**
   * Guarda el estado del juego que proviene del server...
   */
  const [game, setGame] = useState<GameState>();

  /**
   * Guarda el ID del usuario en cada sesión...
   */
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  /**
   * Guarda los estados de las interacciones de la UI...
   */
  const [uiInteractions, setUiInteractions] = useState<IUInteractions>(
    INITIAL_UI_INTERACTIONS
  );

  /**
   * Guarda el estado para cuando son pops invalidos y agrega una animación...
   */
  const [invalidPop, setInvalidPop] = useState<TInvalidPop>(null);

  /**
   * Se cálcula el ID del usuario que tien el turno
   */
  const turnID = game?.turnID || "";

  /**
   * Se indica si el usuario tiene el turno...
   */
  const hasTurn = yourPlayerId === turnID;

  /**
   * Determinar si el juego ha terminado...
   */
  const isGameOver = game?.isGameOver || false;

  /**
   * Obtener el listado de jugadores...
   */
  const players = game?.players || [];

  /**
   * El lstado de burbujas que ha seleccionado el jugador...
   */
  const selectedBubles = game?.selectBubbles || [];

  /**
   * La columna inicial con la cual está seleccionado las burbujas...
   */
  const selectRow = game?.selectRow ?? -1;

  /**
   * Valida si el jugador ya ha seleccionado burbujas...
   */
  const hasSelectedBubbles = selectedBubles.length !== 0;

  /**
   * Extraer la información que se require de la interacción del UI
   */
  const { disableUI, showCounter, startTimer, waitEffect } = uiInteractions;

  /**
   * Se ontiene el color del board dependiendo del turno...
   */
  const currentColor = showCounter
    ? "INITIAL"
    : getCurrentColor(turnID, players);

  /**
   * Bloquea el UI, para prevenir cualquier acción por parte del usuario...
   */
  const isDisableUI = disableUI || !hasTurn || isGameOver;

  /**
   * Valida si muestra el botón de aceptar las burbujas...
   */
  const showCheckMark = !isDisableUI && hasSelectedBubbles;

  /**
   * Si se muestra el mensaje del turno...
   */
  const showMessage = !showCounter && hasTurn;

  /**
   * Si se muestra el componente que indica que el oponenente está pensando...
   */
  const showOpponentThinks = !showCounter && !hasTurn && startTimer;

  /**
   * Guarda el color actual del turno...
   */
  const colorPlayerTurn = currentColor as TBoardColor;

  /**
   * Efecto para configurar el SDK de Rune
   */
  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId, event }) => {
        /**
         * Determina si se ha reiniciado el juego
         */
        const isNewGame = (event?.name || "") === GAME_ACTION_NAME.StateSync;

        /**
         * Se guarda el estado del juego que proviene del servicio...
         */
        setGame(game);

        /**
         * Indica que es el evento inicial cuando inicia el juego
         */
        if (!action) {
          /**
           * Se guarda el id del player de la sesión actual...
           */
          setYourPlayerId(yourPlayerId);
        }

        /**
         * Si es un nuevo juego, se reinician los estados del juego y de las interacciones
         */
        if (isNewGame) {
          setUiInteractions(INITIAL_UI_INTERACTIONS);
          setInvalidPop(null);
        }

        if (action?.name === GAME_ACTION_NAME.OnSelectBubble) {
          console.log("Para el sonido, es pop? ", game.isBubblePop);

          /**
           * Si es game over, en este caso se bloque el UI y además
           * se detiene el cronometro...
           */
          if (game.isGameOver || game.isAuto) {
            const waitEffect = !game.isGameOver && game.isAuto;

            setUiInteractions((current) => {
              return {
                ...current,
                disableUI: true,
                startTimer: false,
                waitEffect,
              };
            });
          }
        }

        /**
         * Actión que indica que se ha seleccionado una celda...
         */
        if (action?.name === GAME_ACTION_NAME.onNextTurn) {
          /**
           * Se reinicia el estado de pop invalido...
           */
          setInvalidPop(null);

          /**
           * Se bloquea el UI para los dos clientes y se establece
           * la bandera para la interrupción que habilita el UI
           */
          setUiInteractions((current) => {
            return {
              ...current,
              disableUI: true,
              startTimer: false,
              waitEffect: !game.isGameOver,
            };
          });
        }
      },
    });
  }, []);

  /**
   * Función que se ejcuta cuando el counter inicial ha terminado...
   */
  const handleEndStartCounter = useCallback(() => {
    setUiInteractions({
      ...INITIAL_UI_INTERACTIONS,
      showCounter: false,
      startTimer: true,
    });
  }, []);

  /**
   * Para habilitar el UI, una vez se ha hecho un lanzamiento...
   */
  const handleEnabledUI = useCallback(() => {
    setUiInteractions((current) => {
      return {
        ...current,
        disableUI: false,
        startTimer: true,
        waitEffect: false,
      };
    });
  }, []);

  /**
   * Interrupción para habilitar el UI...
   */
  useWait(waitEffect, DELAY_START_TIMER, handleEnabledUI);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  /**
   * Función que se ejecuta cuando se selecciona una burbuja...
   * @param position
   */
  const handleSelectBubble = (position: IMatrix) => {
    if (!isDisableUI) {
      validateSelectBubble({
        selectedBubles,
        position,
        selectRow,
        bubbles: game.bubbles,
        setInvalidPop,
      });
    }
  };

  /**
   * Para validar el siguiente turno...
   */
  const handleNextTurn = () => {
    if (!isDisableUI) {
      validateNextTurn(setUiInteractions);
    }
  };

  /**
   * Función que se ejecuta cuando el tiempo del turno
   * ha terminado...
   */
  const handleInterval = () => {
    if (!isDisableUI) {
      getRandomBubble({
        selectedBubles,
        bubbles: game.bubbles,
        setUiInteractions,
      });
    }
  };

  return (
    <GameWrapper currentColor={currentColor} disableUI={isDisableUI}>
      {showCounter && (
        <StartCounter handleEndStartCounter={handleEndStartCounter} />
      )}
      <CounterTurn
        players={players}
        startTimer={startTimer}
        turnID={turnID}
        handleInterval={handleInterval}
      />
      {showOpponentThinks && <OpponentThinks currentColor={colorPlayerTurn} />}
      <Grid>
        <Bubbles
          bubbles={game.bubbles}
          invalidPop={invalidPop}
          selectBubbles={selectedBubles}
          onClick={handleSelectBubble}
        />
      </Grid>
      {showCheckMark && (
        <Checkmark color={colorPlayerTurn} onClick={handleNextTurn} />
      )}
      {showMessage && <ShowTurn currentColor={colorPlayerTurn} />}
    </GameWrapper>
  );
};

export default Game;
