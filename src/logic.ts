import { cellPositionInRage } from "./utils/indexInRange";
import { EBoardColor, EBubbleColors, TOTAL_CELLS } from "./utils/constants";
import { PlayerId } from "rune-sdk";
import { randomNumber } from "./utils/randomNumber";
import type { GameState, IBubble, Player, TBubbleColors } from "./interfaces";

/**
 * Devuelve la información del jugador que ha hecho alguna acción...
 * @param game
 * @param playerId
 * @param allPlayerIds
 * @returns
 */
export const getCurretPlayer = (players: Player[], playerId: PlayerId) => {
  const currentIndex = players.findIndex((v) => v.playerID === playerId);

  if (currentIndex < 0) {
    throw Rune.invalidAction();
  }

  return currentIndex;
};

/**
 * Generar la matriz de burbujas inicial...
 * @returns
 */
const getInitialBubbles = () => {
  const bubbles: IBubble[][] = [];
  const colors = Object.keys(EBubbleColors) as TBubbleColors[];

  for (let row = 0; row < TOTAL_CELLS; row++) {
    bubbles[row] = [];

    for (let col = 0; col < TOTAL_CELLS; col++) {
      const color = colors[row];

      bubbles[row][col] = {
        position: { row, col },
        color,
        isPop: false,
        isDisabled: false,
      };
    }
  }

  return bubbles;
};

/**
 * Genera la data inicial de cada jugador...
 * @param allPlayerIds
 * @returns
 */
const getPlayerData = (allPlayerIds: string[]): GameState => {
  /**
   * Listado de players..
   */
  const players: Player[] = [];
  /**
   * Determina el color inicial de forma aleatoria...
   */
  const initialColor = randomNumber(0, 1);
  /**
   * Se establecen los colores para cada jugador...
   */
  const colorPlayer1 = initialColor === 0 ? EBoardColor.BLUE : EBoardColor.RED;
  const colorPlayer2 = initialColor === 0 ? EBoardColor.RED : EBoardColor.BLUE;

  /**
   * Se crea la data para los jugadores...
   */
  players.push(
    {
      playerID: allPlayerIds[0],
      color: colorPlayer1,
    },
    {
      playerID: allPlayerIds[1],
      color: colorPlayer2,
    }
  );

  /**
   * Se obtiene aleatoriamente el jugador que inicia la partida...
   */
  const turnNumber = randomNumber(0, 1);

  /**
   * Y se guarda el id del usuario que inicia la partida, ya que con este
   * es el que se identifica el jugador no el número obtenido...
   */
  const turnID = allPlayerIds[turnNumber];

  /**
   * Obtener la información inicial de las burbujas...
   */
  const bubbles = getInitialBubbles();

  return {
    players,
    turnID,
    selectBubbles: [],
    selectRow: -1,
    isBubblePop: false,
    isGameOver: false,
    bubbles,
  };
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectBubble: (position, { game }) => {
      // playerId
      /**
       * Saber si la posición está en rango...
       */
      if (!cellPositionInRage(position)) {
        throw Rune.invalidAction();
      }

      /**
       * Se obtiene el index del usuario que hizo el lanzamiento...
       */
      // const currentIndex = getCurretPlayer(game.players, playerId);

      /**
       * Se debe saber si la burbuja ya estaba selecccioanda...
       */
      const indexSelectedBubble = game.selectBubbles.findIndex(
        (v) => v.row === position.row && v.col === position.col
      );

      /**
       * Para saber si la acción era de deseleccionar la burbuja...
       */
      const isDeselectedBubble = indexSelectedBubble >= 0;

      /**
       * Para saber si se hizo pop en la burbuja...
       */
      const isBubblePop = !isDeselectedBubble;

      /**
       * Se establece el estado de la burbuja...
       */
      game.bubbles[position.row][position.col].isPop = isBubblePop;

      /**
       * Se actualiza el valor que será usando en el cliente
       * en ente caso para el sonido...
       */
      game.isBubblePop = isBubblePop;

      /**
       * Se guarda la columna seleccioanda...
       */
      if (game.selectBubbles.length === 0) {
        game.selectRow = position.row;
      }

      /**
       * Ahora guardar/actualizar el listado de burbujas seleccionadas...
       */
      if (isDeselectedBubble) {
        game.selectBubbles.splice(indexSelectedBubble, 1);
      } else {
        game.selectBubbles.push(position);
      }
    },
    onNextTurn: (_, { game, playerId }) => {
      // Se debe establecer -1 a game.players[currentIndex].selectRow
      console.log({ game, playerId });
    },
  },
});
