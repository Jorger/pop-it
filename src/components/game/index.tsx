import { GameState } from "../../logic";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import { Bubble, Checkmark, GameWrapper, Grid } from "./components";

const tmpCOlor = "BLUE";

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
    <GameWrapper currentColor={tmpCOlor}>
      <Grid>
        <Bubble
          isPop={false}
          isSelected={false}
          isDisabled={false}
          color="PURPLE"
          position={{ row: 0, col: 0 }}
          onClick={(data) => console.log(data)}
        />
      </Grid>
      <Checkmark color={tmpCOlor} onClick={() => console.log("ACEPTA")} />
    </GameWrapper>
  );
};

export default Game;
