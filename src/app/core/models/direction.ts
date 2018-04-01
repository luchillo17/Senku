export const enum DirIndex { x, y }

export type Direction = [ number, number ];

export interface Directions {
  [ key: string ]: Direction;
}

export const directions: Directions = {
  east: [ 1, 0 ],
  west: [ -1, 0 ],
  north: [ 0, -1 ],
  south: [ 0, 1 ],
};
