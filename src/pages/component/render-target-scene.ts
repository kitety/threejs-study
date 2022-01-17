import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ffff);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
camera.position.z = 10;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);

const colors = ['blue', 'green', 'red'];

const boxs: THREE.Mesh[] = [];

colors.forEach((color, i) => {
  const material = new THREE.MeshPhongMaterial({ color });
  const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
  const box = new THREE.Mesh(geometry, material);
  box.position.set((i - 1) * 3, 0, 0);
  boxs.push(box);
  scene.add(box);
});


export {
  scene,
  camera,
  boxs,
}
