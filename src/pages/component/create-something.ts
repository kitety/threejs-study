import {
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PointLight,
  SphereBufferGeometry,
} from 'three';

// 创建一个球体
//球体为6边形，目的是为了方便我们观察到他在自转
const sphere = new SphereBufferGeometry(1, 6, 6);

// 创建太阳
const sunMaterial = new MeshPhongMaterial({ emissive: 0xffff00 });
const sun = new Mesh(sphere, sunMaterial);
sun.scale.set(4, 4, 4);

// 地球
const earthMaterial = new MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244,
});
const earthMesh = new Mesh(sphere, earthMaterial);

// 月球
const moonMaterial = new MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
});
const moonMesh = new Mesh(sphere, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);

//创建一个 3D 空间，用来容纳月球，相当于月球轨迹空间
export const moonOrbit = new Object3D();
moonOrbit.position.x = 2;
moonOrbit.add(moonMesh);

//创建一个 3D 空间，用来容纳地球，相当于地球轨迹空间
export const earthOrbit = new Object3D();
earthOrbit.position.x = 10;
earthOrbit.add(earthMesh);
earthOrbit.add(moonOrbit);
// window.earthOrbit = earthOrbit;

//创建一个 3D 空间，用来容纳太阳和地球(含月球)
export const sunEarthOrbit = new Object3D();
sunEarthOrbit.add(sun);
sunEarthOrbit.add(earthOrbit);

// 创建一个光源
export const pointLight = new PointLight(0xffffff, 3);
