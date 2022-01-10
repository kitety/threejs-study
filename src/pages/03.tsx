import { useMount } from 'ahooks';
import { useEffect, useRef } from 'react';
import {
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

export default function IndexPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      // 创建渲染器
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });
      // 创建镜头
      // perspective
      const camera = new PerspectiveCamera(75, 2, 0.1, 5);

      // 创建场景
      const scene = new Scene();
      const geometry = new BoxGeometry(1, 1, 1);
      //创建材质
      //我们需要让立方体能够反射光，所以不使用MeshBasicMaterial，而是改用MeshPhongMaterial
      const material = new MeshPhongMaterial({ color: 0x44aa88 });

      // 网格
      const mesh = new Mesh(geometry, material);
      scene.add(mesh);

      // 创建光源
      const light = new DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
    }
  }, [canvasRef]);
  return <canvas ref={canvasRef} />;
}
