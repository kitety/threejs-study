import { useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, { DatFolder, DatNumber, DatSelect } from 'react-dat-gui';
import { useRef } from 'react';

const gebcoBathy =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220218181648.png';

const worldColorImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/worldColour.5400x2700.jpg';

const normalImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/material-textures-3.zip-earth_normalmap_8192x4096.jpg';

// 背景图
const bgImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220218194720.png';

const mipmap = (size: number, color: string) => {
  const imageCanvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = imageCanvas.getContext('2d')! as CanvasRenderingContext2D;
  imageCanvas.width = size;
  imageCanvas.height = size;
  context.fillStyle = '#888888';
  context.fillRect(0, 0, size, size);
  context.fillStyle = color;
  context.fillRect(0, 0, size / 2, size / 2);
  context.fillRect(size / 2, size / 2, size / 2, size / 2);
  return imageCanvas;
};

const Index = () => {
  const objectRef = useRef<
    Array<
      | THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>
      | THREE.MeshPhongMaterial
    >
  >([]);
  const lightRef = useRef<THREE.SpotLight | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    },
  });
  useMount(() => {
    const scene1 = new THREE.Scene();
    scene1.add(new THREE.AxesHelper(5));
    // scene1.background = new THREE.Color(0xffff00);
    const scene2 = new THREE.Scene();
    scene2.add(new THREE.AxesHelper(5));
    // scene2.background = new THREE.Color(0xff00ff);

    const light = new THREE.SpotLight(0xffffff, 2);
    light.position.set(0, 5, 10);
    // scene1.add(light);
    lightRef.current = light;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 0, 1);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    const planeGeometry1 = new THREE.PlaneGeometry();
    const planeGeometry2 = new THREE.PlaneGeometry();

    // const texture1 = new THREE.TextureLoader().load(bgImg);
    // const texture2 = new THREE.TextureLoader().load(bgImg);
    const blankCanvas = document.createElement('canvas') as HTMLCanvasElement;
    blankCanvas.width = 128;
    blankCanvas.height = 128;
    const texture1 = new THREE.CanvasTexture(blankCanvas);
    texture1.mipmaps[0] = mipmap(128, '#ff0000');
    texture1.mipmaps[1] = mipmap(64, '#00ff00');
    texture1.mipmaps[2] = mipmap(32, '#0000ff');
    texture1.mipmaps[3] = mipmap(16, '#880000');
    texture1.mipmaps[4] = mipmap(8, '#008800');
    texture1.mipmaps[5] = mipmap(4, '#000088');
    texture1.mipmaps[6] = mipmap(2, '#008888');
    texture1.mipmaps[7] = mipmap(1, '#880088');
    texture1.repeat.set(5, 5);
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    const texture2 = new THREE.CanvasTexture(blankCanvas);
    texture2.mipmaps[0] = mipmap(128, '#ff0000');
    texture2.mipmaps[1] = mipmap(64, '#00ff00');
    texture2.mipmaps[2] = mipmap(32, '#0000ff');
    texture2.mipmaps[3] = mipmap(16, '#880000');
    texture2.mipmaps[4] = mipmap(8, '#008800');
    texture2.mipmaps[5] = mipmap(4, '#000088');
    texture2.mipmaps[6] = mipmap(2, '#008888');
    texture2.mipmaps[7] = mipmap(1, '#880088');
    texture2.repeat.set(5, 5);
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    // 关键的字段
    texture2.minFilter = THREE.NearestFilter;
    texture2.magFilter = THREE.NearestFilter;

    const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
    const material2 = new THREE.MeshBasicMaterial({ map: texture2 });

    textureRef.current = texture2;

    const plane1 = new THREE.Mesh(planeGeometry1, material1);
    const plane2 = new THREE.Mesh(planeGeometry2, material2);
    scene1.add(plane1);
    scene2.add(plane2);

    window.addEventListener('resize', onWindowResize, false);
    function render() {
      renderer.setScissorTest(true);

      renderer.setScissor(
        0,
        0,
        window.innerWidth / 2 - 104,
        window.innerHeight - 50,
      );
      renderer.render(scene1, camera);

      renderer.setScissor(
        window.innerWidth / 2 - 100,
        0,
        window.innerWidth / 2 - 98,
        window.innerHeight - 50,
      );
      renderer.render(scene2, camera);

      renderer.setScissorTest(false);
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      render();
    }
    function animate() {
      controls.update();
      render();
      requestAnimationFrame(animate);
    }
    renderRef.current = animate;

    animate();
  });

  const handleUpdate = (value: typeof state.data) => {
    state.data = value;
    if (textureRef.current) {
      textureRef.current.minFilter = THREE[
        value.minFilter as unknown as keyof typeof THREE
      ] as THREE.TextureFilter;
      textureRef.current.magFilter = THREE[
        value.magFilter as unknown as keyof typeof THREE
      ] as THREE.TextureFilter;
      textureRef.current.needsUpdate = true;
    }
  };
  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="PlaneGeometry" closed={false}>
          <DatSelect
            path="minFilter"
            options={[
              'NearestFilter',
              'NearestMipMapLinearFilter',
              'NearestMipMapNearestFilter',
              'LinearFilter',
              'LinearMipMapLinearFilter',
              'LinearMipmapNearestFilter',
            ]}
          />
          <DatSelect
            path="magFilter"
            options={['NearestFilter', 'LinearFilter']}
          />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
