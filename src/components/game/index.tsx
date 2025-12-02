import { GameState } from "../../logic";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import { GameWrapper } from "./components";

const Game = () => {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);

        console.log(game);
      },
    });
  }, []);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  console.log(yourPlayerId);

  return (
    <GameWrapper>
      <div style={{ color: "white" }}>Inicia el Juego!!</div>
    </GameWrapper>
  );
};

export default Game;
