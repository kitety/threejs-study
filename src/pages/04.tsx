import React, { useCallback, useEffect, useRef } from 'react';
import * as Three from 'three';
import {
  cone,
  cylinder,
  dodecahedron,
  edges,
  extrude,
  icos,
  lathe,
  myBox,
  myCircle,
  myOctahedron,
  plane,
  polyhedron,
  ring,
  shapeG,
  Sphere,
  tetrahedron,
  torus,
  torusknot,
  wireframe,
} from './component/03';

const meshArr: (Three.Mesh | Three.LineSegments)[] = [];
const Primitives = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null);

  const createMaterial = () => {
    const material = new Three.MeshPhongMaterial({ side: Three.DoubleSide });
    const hue = (Math.random() * 100) / 100; //随机获得一个色相
    console.log('hue: ', hue);
    // 饱和度
    const saturation = (Math.random() * 100) / 100;
    // 亮度
    const luminance = (Math.random() * 100) / 100;
    material.color.setHSL(hue, saturation, luminance);
    return material;
  };
  const createText = () => {
    const loader = new FontLoader();
    const url =
      'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json';

    const onLoadHandle = (responseFont: Font) => {
      console.log(responseFont);
    };
    const onProgressHandle = (event: ProgressEvent<EventTarget>) => {
      console.log(event);
    };
    const onErrorHandle = (error: ErrorEvent) => {
      console.log(error);
    };

    loader.load(url, onLoadHandle, onProgressHandle, onErrorHandle);
  };

  const createInit = useCallback(() => {
    if (canvasRef.current) {
      meshArr.length = 0;

      // 初始化场景
      const scene = new Three.Scene();
      scene.background = new Three.Color(0xaaaaaa);

      // 初始化镜头
      const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000);
      //  camera.position.z = 120
      camera.position.set(0, 0, 120);
      cameraRef.current = camera;

      // 初始化渲染器
      const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
      rendererRef.current = renderer;

      // 添加两个灯光
      const light0 = new Three.DirectionalLight(0xffffff, 1);
      light0.position.set(-1, 2, 4);
      scene.add(light0);

      const light1 = new Three.DirectionalLight(0xffffff, 1);
      light1.position.set(1, -2, -4);
      scene.add(light1);

      //获得各个 solid 类型的图元实例，并添加到 solidPrimitivesArr 中
      const solidPrimitivesArr: Three.BufferGeometry[] = [];
      solidPrimitivesArr.push(myBox, myCircle, cone, cylinder, dodecahedron);
      solidPrimitivesArr.push(extrude, icos, lathe, myOctahedron, plane);
      solidPrimitivesArr.push(polyhedron, ring, shapeG, Sphere, tetrahedron);
      solidPrimitivesArr.push(torus, torusknot);

      solidPrimitivesArr.forEach((item) => {
        const material = createMaterial();
        const mesh = new Three.Mesh(item, material);
        meshArr.push(mesh);
      });

      //获得各个 line 类型的图元实例，并添加到 meshArr 中
      const linePrimitivesArr: Three.BufferGeometry[] = [edges, wireframe];
      linePrimitivesArr.forEach((item) => {
        const mesh = new Three.LineSegments(item, createMaterial());
        meshArr.push(mesh);
      });

      //定义物体在画面中显示的网格布局
      const eachRow = 5; //每一行显示 5 个
      const spread = 15; //行高 和 列宽

      //配置每一个图元实例，转化为网格，并位置和材质后，将其添加到场景中
      meshArr.forEach((mesh, index) => {
        //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
        //因此每个物体根据顺序，计算出自己所在的位置
        const row = Math.floor(index / eachRow); //计算出所在行
        const column = index % eachRow; //计算出所在列

        mesh.position.x = (column - 2) * spread; //为什么要 -2 ？
        //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
        mesh.position.y = (2 - row) * spread;

        scene.add(mesh); //将网格添加到场景中
      });
      //添加自动旋转渲染动画
      const render = (time: number) => {
        time = time * 0.001;
        meshArr.forEach((item) => {
          item.rotation.x = time;
          item.rotation.y = time;
        });

        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);
    }
  }, [canvasRef]);
  const resizeHandle = () => {
    //根据窗口大小变化，重新修改渲染器的视椎
    if (rendererRef.current && cameraRef.current) {
      const canvas = rendererRef.current.domElement;
      cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        canvas.clientWidth,
        canvas.clientHeight,
        false,
      );
    }
  };

  //组件首次装载到网页后触发，开始创建并初始化 3D 场景
  useEffect(() => {
    createInit();
    resizeHandle();
    window.addEventListener('resize', resizeHandle);
    return () => {
      window.removeEventListener('resize', resizeHandle);
    };
  }, [canvasRef, createInit]);
  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Primitives;
