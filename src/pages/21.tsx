import { loadDataFile } from '@/utils/loadDataFile';
import { useReactive, useRequest } from 'ahooks';
import { useEffect, useRef } from 'react';
import * as Three from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const url =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/gpw_v4_014mt_2010.asc';

const hsl = (h: number, s: number, l: number) => {
  return `hsl(${(h * 360) | 0},${(s * 100) | 0}%,${(l * 100) | 0}%)`;
};

type DataType = (number | undefined)[][];
interface ASCData {
  data: DataType;
  // ncols 个数字构成
  ncols: number;
  // 条
  nrows: number;
  xllcorner: number;
  yllcorner: number;
  cellsize: number;
  NODATA_value: number;
  // 用来记录所有地区人口数据中最多和最少的人口数量，以此我们方便计算出 柱状高度比例
  max: number;
  min: number;
}
let renderRequested = false;
const PreserveDrawingBuffer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const state = useReactive({
    ascData: {} as ASCData,
    loaded: false,
  });
  useRequest(() => loadDataFile(url), {
    onSuccess: (text: string) => {
      const data: (number | undefined)[][] = [];
      const settings: { [key: string]: any } = { data };
      let max: number = 0;
      let min: number = 99999;
      text.split('\n').forEach((line: string) => {
        const parts = line.trim().split(/\s+/);

        if (parts.length === 2) {
          settings[parts[0]] = Number(parts[1]);
        } else if (parts.length > 2) {
          const values = parts.map((item) => {
            const value = Number(item);
            if (value === settings['NODATA_value']) {
              return undefined;
            }
            max = Math.max(max, value);
            min = Math.min(min, value);
            return value;
          });
          data.push(values);
        }
      });
      const data2 = { ...settings, ...{ max, min } } as ASCData;
      console.log('data2: ', data2);
      state.ascData = data2;
      // drawData(state.ascData);
      state.loaded = true;
    },
  });
  const drawData = (ascData: ASCData) => {
    if (canvasRef.current === null) {
      return;
    }
    const ctx = canvasRef.current.getContext('2d');
    if (ctx === null) {
      return;
    }

    const range = ascData.max - ascData.min;
    ctx.canvas.width = ascData.ncols;
    ctx.canvas.height = ascData.nrows;
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ascData.data.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === undefined) {
          return;
        }
        const amount = (value - ascData.min) / range;
        const hue = 1;
        const saturation = 1;
        const lightness = amount;
        ctx.fillStyle = hsl(hue, saturation, lightness);
        ctx.fillRect(colIndex, rowIndex, 1, 1);
      });
    });
  };
  const addBoxes = (ascData: ASCData, scene: Three.Scene) => {
    console.log('scene: ', scene);
    // const geometry = new Three.BoxBufferGeometry(1, 1, 1);
    // geometry.applyMatrix4(new Three.Matrix4().makeTranslation(0, 0, 0.5));

    const lonHelper = new Three.Object3D();
    scene.add(lonHelper);

    const latHelper = new Three.Object3D();
    lonHelper.add(latHelper);

    const positionHelper = new Three.Object3D();
    positionHelper.position.set(0, 0, 1);
    latHelper.add(positionHelper);

    const originHelper = new Three.Object3D();
    originHelper.position.set(0, 0, 0.5);
    positionHelper.add(positionHelper);

    const range = ascData.max - ascData.min;

    const lonFudge = Math.PI / 2;
    const latFudge = Math.PI * -0.135;
    const geometries: Three.BoxBufferGeometry[] = [];
    const color = new Three.Color();
    ascData.data.forEach((row, latIndex) => {
      row.forEach((value, lonIndex) => {
        if (value === undefined) {
          return;
        }
        const amount = (value - ascData.min) / range;
        // const material = new Three.MeshBasicMaterial();
        // const hue = Three.MathUtils.lerp(0.7, 0.3, amount);

        // const saturation = 1;
        // const lightness = Three.MathUtils.lerp(0.1, 1, amount);
        // material.color.setHSL(hue, saturation, lightness);
        // const mesh = new Three.Mesh(geometry, material);
        // console.log('mesh: ', mesh);

        // scene.add(mesh);

        const geometry = new Three.BoxBufferGeometry(1, 1, 1);
        lonHelper.rotation.y =
          Three.MathUtils.degToRad(lonIndex + ascData.xllcorner) + lonFudge;
        latHelper.rotation.x =
          Three.MathUtils.degToRad(latIndex + ascData.yllcorner) + latFudge;

        positionHelper.scale.set(
          0.005,
          0.005,
          Three.MathUtils.lerp(0.01, 0.5, amount),
        );
        originHelper.updateWorldMatrix(true, false);
        geometry.applyMatrix4(originHelper.matrixWorld);

        const hue = Three.MathUtils.lerp(0.7, 0.3, amount);
        const saturation = 1;
        const lightness = Three.MathUtils.lerp(0.1, 1, amount);
        color.setHSL(hue, saturation, lightness);

        const rgb = color.toArray().map((i) => 255 * i);
        const numVerts = geometry.attributes.position.count;
        const itemSize = 3;
        const colors = new Uint8Array(numVerts * itemSize);

        //这里有一个稍微奇葩点的写法，就是使用下划线 _ 来起到参数占位的作用
        colors.forEach((_, index) => {
          colors[index] = rgb[index % 3];
        });
        const normalized = true;
        const colorAttrib = new Three.BufferAttribute(
          colors,
          itemSize,
          normalized,
        );
        geometry.setAttribute('color', colorAttrib);

        geometries.push(geometry);
      });
    });
    const mergedGeometry = mergeBufferGeometries(geometries);
    //const material = new Three.MeshBasicMaterial({ color: 'red' })
    const material = new Three.MeshBasicMaterial({
      vertexColors: true,
    });
    const mesh = new Three.Mesh(mergedGeometry, material);
    scene.add(mesh);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && state.loaded) {
      console.log('canvas: ', canvas);
      const renderer = new Three.WebGLRenderer({ canvas });
      const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
      camera.position.set(0, 0, 4);

      const scene = new Three.Scene();
      scene.background = new Three.Color(0xeeeeee);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.update();

      const render = () => {
        renderRequested = false;
        controls.update();
        renderer.render(scene, camera);
      };

      const handleChange = () => {
        if (renderRequested === false) {
          renderRequested = true;
          window.requestAnimationFrame(render);
        }
      };
      controls.addEventListener('change', handleChange);

      const loader = new Three.TextureLoader();
      const texture = loader.load(
        'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220120201249.png',
        render,
      );

      const material = new Three.MeshBasicMaterial({ map: texture });

      const geometry = new Three.SphereBufferGeometry(1, 64, 32);
      const earth = new Three.Mesh(geometry, material);
      scene.add(earth);

      const handleResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);

        window.requestAnimationFrame(render);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      addBoxes(state.ascData, scene);
      render();

      return () => {
        controls.removeEventListener('change', handleChange);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef, state.loaded]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default PreserveDrawingBuffer;
