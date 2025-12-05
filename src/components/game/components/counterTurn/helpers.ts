import type { Player, TUserAvatar } from "../../../../interfaces";

/**
 * Devuelve la información del avatar el jugador...
 * @param players
 * @returns
 */
export const getUserAvatar = (players: Player[]) => {
  const userAvatar: TUserAvatar = {};

  for (const { playerID } of players) {
    const playerInfo = Rune.getPlayerInfo(playerID);
    userAvatar[playerID] = playerInfo.avatarUrl;
  }

  return userAvatar;
};
