export enum BoardTypes {
  cross,
  plus,
  fireplace,
  eight,
  piramid,
  arrow1,
  hercules,
  mirror,
  arrow2,
  diamond,
  intersection,
  solitair,
  custom,
}

export const enum CellState {
  none = -1,
  void,
  peg,
}

export const boards = {
  [ BoardTypes.cross ]: [
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
  ],
  [ BoardTypes.plus ]: [
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ 0,  1,  1, 1, 1, 1,  0  ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
  ],
  [ BoardTypes.fireplace ]: [
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ 0,  0,  1, 0, 1, 0,  0  ],
    [ 0,  0,  0, 0, 0, 0,  0  ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
  ],
  [ BoardTypes.eight ]: [
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  0,  1, 0, 1, 0,  0  ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ 0,  0,  1, 0, 1, 0,  0  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
  ],
  [ BoardTypes.piramid ]: [
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ 0,  1,  1, 1, 1, 1,  0  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
  ],
  [ BoardTypes.arrow1 ]: [
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  1,  1, 1, 1, 1,  0  ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
  ],
  [ BoardTypes.hercules ]: [
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ 0,  0,  1, 0, 1, 0,  0  ],
    [ -1, -1, 1, 0, 1, -1, -1 ],
    [ -1, -1, 1, 0, 1, -1, -1 ],
  ],
  [ BoardTypes.mirror ]: [
    [ -1, -1, 0, 0, 0, -1, -1 ],
    [ -1, -1, 1, 0, 1, -1, -1 ],
    [ 0,  1,  1, 0, 1, 1,  0  ],
    [ 1,  1,  1, 0, 1, 1,  1  ],
    [ 0,  1,  1, 0, 1, 1,  0  ],
    [ -1, -1, 1, 0, 1, -1, -1 ],
    [ -1, -1, 0, 0, 0, -1, -1 ],
  ],
  [ BoardTypes.arrow2 ]: [
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  1,  1, 1, 1, 1,  0  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ 0,  0,  0, 1, 0, 0,  0  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
  ],
  [ BoardTypes.diamond ]: [
    [ -1, -1, 0, 1, 0, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  1,  1, 1, 1, 1,  0  ],
    [ 1,  1,  1, 0, 1, 1,  1  ],
    [ 0,  1,  1, 1, 1, 1,  0  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 0, 1, 0, -1, -1 ],
  ],
  [ BoardTypes.intersection ]: [
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ 0,  0,  1, 1, 1, 0,  0  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
  ],
  [ BoardTypes.solitair ]: [
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ 1,  1,  1, 0, 1, 1,  1  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
  ],
  [ BoardTypes.custom ]: [
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ 1,  1,  1, 1, 1, 1,  1  ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
    [ -1, -1, 1, 1, 1, -1, -1 ],
  ],
};