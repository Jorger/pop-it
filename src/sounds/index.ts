import { Howl } from "howler";
import { Sounds, TESounds } from "../interfaces";
import {
  counter,
  deselectBubble,
  gameOver,
  nextTurn,
  selectBubble,
  whistle,
  wrongBubble,
} from "./getSounds";

const SOUNDS: Sounds = {
  COUNTER: new Howl({
    src: [counter],
  }),
  DESELECT_BUBBLE: new Howl({
    src: [deselectBubble],
  }),
  GAME_OVER: new Howl({
    src: [gameOver],
  }),
  NEXT_TURN: new Howl({
    src: [nextTurn],
  }),
  SELECT_BUBBLE: new Howl({
    src: [selectBubble],
  }),
  WHISTLE: new Howl({
    src: [whistle],
  }),
  WRONG_BUBBLE: new Howl({
    src: [wrongBubble],
  }),
};

export const playSound = (type: TESounds) => SOUNDS[type].play();
