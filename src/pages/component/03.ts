import {
  BoxBufferGeometry,
  CircleBufferGeometry,
  ConeBufferGeometry,
  Curve,
  CylinderBufferGeometry,
  DodecahedronGeometry,
  EdgesGeometry,
  ExtrudeBufferGeometry,
  IcosahedronBufferGeometry,
  LatheBufferGeometry,
  OctahedronBufferGeometry,
  PlaneGeometry,
  PolyhedronGeometry,
  RingGeometry,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WireframeGeometry,
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
// export const Parametric = new ParametricGeometry( ParametricGeometries.klein, 25, 25 );
export const plane = new PlaneGeometry(4, 4);

const verticesOfCube = [
  -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1,
  1, 1,
];

const indicesOfFaces = [
  2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2, 3,
  7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
];

export const polyhedron = new PolyhedronGeometry(
  verticesOfCube,
  indicesOfFaces,
  6,
  2,
);

export const ring = new RingGeometry(1, 5, 8);

const x = 0,
  y = 0;

const heartShape = new Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

export const shapeG = new ShapeGeometry(heartShape);

export const Sphere = new SphereGeometry(4, 32, 16);
export const tetrahedron = new TetrahedronGeometry(4, 0);
export const torus = new TorusGeometry(5, 3, 16, 100);
export const torusknot = new TorusKnotGeometry(5, 3, 100, 16);

class CustomSinCurve extends Curve<unknown> {
  constructor(scale = 1) {
    super();

    this.scale = scale;
  }

  getPoint(t, optionalTarget = new Vector3()) {
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

const path = new CustomSinCurve(10);
export const tube = new TubeGeometry(path, 20, 2, 8, false);
const geometry1 = new SphereGeometry(4, 4, 4);

export const wireframe = new WireframeGeometry(geometry1);
