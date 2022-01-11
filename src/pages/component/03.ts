import {
  BoxBufferGeometry,
  CircleBufferGeometry,
  ConeBufferGeometry,
  CylinderBufferGeometry,
  DodecahedronGeometry,
  EdgesGeometry,
  ExtrudeBufferGeometry,
  IcosahedronBufferGeometry,
  LatheBufferGeometry,
  OctahedronBufferGeometry,
  Shape,
  Vector2,
} from 'three';

let width = 8;
const height = 8;
const depth = 8;

export const myBox = new BoxBufferGeometry(width, height, depth);

const radius = 7;
const segments = 24;

export const myCircle = new CircleBufferGeometry(radius, segments);

export const cone = new ConeBufferGeometry(5, 20, 32);
export const cylinder = new CylinderBufferGeometry(5, 5, 20, 32);
export const dodecahedron = new DodecahedronGeometry(5);

const geometry = new BoxBufferGeometry(5, 5, 5);
export const edges = new EdgesGeometry(geometry);

const length = 3;

var shape = new Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

var extrudeSettings = {
  steps: 2,
  depth: 4,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelSegments: 1,
};

export const extrude = new ExtrudeBufferGeometry(shape, extrudeSettings);
export const icos = new IcosahedronBufferGeometry(4);

var points = [];
for (var i = 0; i < 10; i++) {
  points.push(new Vector2(Math.sin(i * 0.2) * 4 + 5, (i - 2) * 1));
}
export const lathe = new LatheBufferGeometry(points);

export const myOctahedron = new OctahedronBufferGeometry(3);
