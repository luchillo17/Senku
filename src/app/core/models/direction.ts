// Direction prop index in a Direction array
export const enum DirIndex { x, y }

// Direction array, format [x, y]
export type Direction = [ number, number ];

// Direction object
export interface Directions {
  [ key: string ]: Direction;
}

// Directions constant that can be used to generate moves from peg
export const directions: Directions = {
  east: [ 1, 0 ],
  west: [ -1, 0 ],
  north: [ 0, -1 ],
  south: [ 0, 1 ],
};
