import { Bubbles, Checkmark, GameWrapper, Grid } from "./components";
import { getCurrentColor, validateSelectBubble } from "./helpers";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import {
  GAME_ACTION_NAME,
  INITIAL_UI_INTERACTIONS,
} from "../../utils/constants";
import type {
  GameState,
  IMatrix,
  IUInteractions,
  TBoardColor,
} from "../../interfaces";

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
   * Obtiene la información del jugador actual en cada sesión...
   */
  // const currentPlayer = getPlayerByID(yourPlayerId || "", players);

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
  const { disableUI } = uiInteractions;

  /**
   * Se ontiene el color del board dependiendo del turno...
   */
  const currentColor = getCurrentColor(turnID, players);

  /**
   * Bloquea el UI, para prevenir cualquier acción por parte del usuario...
   */
  const isDisableUI = disableUI || !hasTurn || isGameOver;

  /**
   * Valida si muestra el botón de aceptar las burbujas...
   */
  const showCheckMark = !isDisableUI && hasSelectedBubbles;

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

        // console.log(game);

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
        }

        if (action?.name === GAME_ACTION_NAME.OnSelectBubble) {
          console.log("ES POP? ", game.isBubblePop);
        }

        /**
         * Actión que indica que se ha seleccionado una celda...
         */
        if (action?.name === GAME_ACTION_NAME.onNextTurn) {
          /**
           * Se bloquea el UI y se pasa la validación de game over...
           */
          setUiInteractions((current) => {
            return {
              ...current,
              disableUI: true,
              startTimer: false,
              waitEffect: true,
              isGameOver: game.isGameOver,
            };
          });
        }
      },
    });
  }, []);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  const handleSelectBubble = (position: IMatrix) => {
    if (!isDisableUI) {
      validateSelectBubble({
        selectedBubles,
        position,
        selectRow,
        bubbles: game.bubbles,
      });
    }
  };

  // console.log(game.bubbles);

  return (
    <GameWrapper currentColor={currentColor} disableUI={isDisableUI}>
      <Grid>
        <Bubbles
          bubbles={game.bubbles}
          selectBubbles={selectedBubles}
          onClick={handleSelectBubble}
        />
      </Grid>
      {showCheckMark && (
        <Checkmark
          color={currentColor as TBoardColor}
          onClick={() => console.log("ACEPTA")}
        />
      )}
    </GameWrapper>
  );
};

export default Game;
