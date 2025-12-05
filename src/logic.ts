import { cellPositionInRage } from "./utils/indexInRange";
import { getIndexInSelectBubbles } from "./utils/isPositionInSelectBubbles";
import { PlayerId } from "rune-sdk";
import { randomNumber } from "./utils/randomNumber";
import {
  EBoardColor,
  EBubbleColors,
  TOTAL_CELLS,
  TOTAL_CELLS_GRID,
} from "./utils/constants";
import type { GameState, IBubble, Player, TBubbleColors } from "./interfaces";

/**
 * Devuelve la información del jugador que ha hecho alguna acción...
 * @param game
 * @param playerId
 * @param allPlayerIds
 * @returns
 */
const getCurretPlayer = (players: Player[], playerId: PlayerId) => {
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
    isAuto: false,
    isBubblePop: false,
    isGameOver: false,
    bubbles,
  };
};

/**
 * Obtener el total de las burbujas que ya han sido explotadas...
 * @param bubbles
 * @returns
 */
const getTotalPoppedBubbles = (bubbles: IBubble[][]) => {
  let total = 0;

  for (const row of bubbles) {
    for (const bubble of row) {
      if (bubble.isPop && bubble.isDisabled) {
        total++;
      }
    }
  }

  return total;
};

/**
 * Valida el siguiente turno del usuario...
 * @param game
 * @param playerId
 */
const validateNextTurn = (game: GameState, playerId: PlayerId) => {
  /**
   * Si no existen ítems seleccioandos, se muestra un error,
   * ya que en este punto debería...
   */
  if (game.selectRow < 0 || game.selectBubbles.length === 0) {
    throw Rune.invalidAction();
  }

  /**
   * Se obtiene el index del usuario que hizo el lanzamiento...
   */
  const currentIndex = getCurretPlayer(game.players, playerId);

  /**
   * El indice del player contrario...
   */
  const oposieIndexPlayer = currentIndex === 0 ? 1 : 0;

  /**
   * Ahora se debe establecer que los ítems seleccioandos
   * ahora deben quedar, en este caso estableciendo un valor de
   * disabled
   */
  for (const { row, col } of game.selectBubbles) {
    game.bubbles[row][col].isPop = true;
    game.bubbles[row][col].isDisabled = true;
  }

  /**
   * Ahora reiniciar los valores de fila y burbujas seleccioandas
   */
  game.selectRow = -1;
  game.selectBubbles = [];

  /**
   * Valida el game over en este punto...
   */
  validateGameOver(game, playerId);

  /**
   * Ahora establecer el siguiente turno...
   */
  if (!game.isGameOver) {
    game.turnID = game.players[oposieIndexPlayer].playerID;
  }
};

/**
 * Valida si hay game over en el juego..
 * @param game
 * @param playerId
 */
const validateGameOver = (game: GameState, playerId: PlayerId) => {
  /**
   * Obtener el número de burbujas que ya han sido explotadas...
   */
  const totalPoppedBubbles = getTotalPoppedBubbles(game.bubbles);

  /**
   * Valida si es game over...
   */
  game.isGameOver = totalPoppedBubbles === TOTAL_CELLS_GRID;

  /**
   * SI lo es, se valida quien es el ganador y perdedor...
   */
  if (game.isGameOver) {
    /**
     * Se obtiene el index del usuario que hizo el lanzamiento...
     */
    const currentIndex = getCurretPlayer(game.players, playerId);

    /**
     * El indice del player contrario...
     */
    const oposieIndexPlayer = currentIndex === 0 ? 1 : 0;

    /**
     * Se valida el ganar y el perdedor, el perdedor sería el
     * usuario actual, por que es que estalla la última burbuja...
     */
    const winner = game.players[oposieIndexPlayer].playerID;
    const loser = game.players[currentIndex].playerID;

    Rune.gameOver({
      players: {
        [winner]: "WON",
        [loser]: "LOST",
      },
    });
  }
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectBubble: ({ position, isAuto = false }, { game, playerId }) => {
      /**
       * Sirve para indicarle al cliente si fue una acción automática...
       */
      game.isAuto = isAuto;

      /**
       * Saber si la posición está en rango...
       */
      if (!cellPositionInRage(position)) {
        throw Rune.invalidAction();
      }

      /**
       * Obtener el número de burbujas que ya han sido explotadas...
       */
      const totalPoppedBubbles = getTotalPoppedBubbles(game.bubbles);

      /**
       * Para validar si es la última burbuja
       */
      const totalLastBubble = TOTAL_CELLS_GRID - 1;

      /**
       * Indica si e sla última burbuja...
       */
      const isLastBubble = totalPoppedBubbles === totalLastBubble;

      /**
       * Se debe saber si la burbuja ya estaba selecccioanda...
       */
      const indexSelectedBubble = getIndexInSelectBubbles(
        position,
        game.selectBubbles
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
       * Si es la última burbuja, se bloquea la misma...
       */
      game.bubbles[position.row][position.col].isDisabled = isLastBubble;

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

      /**
       * Hacer la validación del game over...
       */
      validateGameOver(game, playerId);

      /**
       * Si se indica que era auto, quiere decir que se le acabó el tiempo,
       * por ello se debe dar el turno al siguiente jugador...
       */
      if (!isLastBubble && isAuto) {
        validateNextTurn(game, playerId);
      }
    },
    onNextTurn: (_, { game, playerId }) => validateNextTurn(game, playerId),
  },
});
