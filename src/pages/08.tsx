import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './08.less';
import { createScene } from './component/create-scene';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const leftViewRef = useRef<HTMLDivElement>(null);
  const rightViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current && leftViewRef.current && rightViewRef.current) {
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      // 开启裁剪
      renderer.setScissorTest(true);
      // 创建场景
      const scene = createScene();
      scene.background = new THREE.Color(0x000000);
      sceneRef.current = scene;

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 10, 0);
      light.target.position.set(5, 0, 0);
      scene.add(light);
      scene.add(light.target);

      const leftCamera = new THREE.PerspectiveCamera(45, 2, 5, 100);
      leftCamera.position.set(0, 10, 20);

      const helper = new THREE.CameraHelper(leftCamera);
      scene.add(helper);

      const leftControl = new OrbitControls(leftCamera, leftViewRef.current);
      leftControl.target.set(0, 5, 0);
      leftControl.update();

      const rightCamera = new THREE.PerspectiveCamera(60, 2, 0.1, 200);
      rightCamera.position.set(40, 10, 30); //为了能够看清、看全镜头，所以将右侧镜头的位置设置稍远一些
      rightCamera.lookAt(0, 5, 0);

      const rightControls = new OrbitControls(
        rightCamera,
        rightViewRef.current,
      );
      rightControls.target.set(0, 5, 0);
      rightControls.update();

      const setScissorForElement = (div: HTMLElement) => {
        if (canvasRef.current) {
          // 获得canvas和div的矩形框尺寸和位置
          const canvasRect = canvasRef.current.getBoundingClientRect();
          const divRect = div.getBoundingClientRect();

          // 计算裁切框的尺寸和位置
          const right =
            Math.min(divRect.right, canvasRect.right) - canvasRect.left;
          const left = Math.max(0, divRect.left - canvasRect.left);
          const bottom =
            Math.min(divRect.bottom, canvasRect.bottom) - canvasRect.top;
          const top = Math.max(0, divRect.top - canvasRect.top);

          const width = Math.min(canvasRect.width, right - left);
          const height = Math.min(canvasRect.height, bottom - top);

          // 设置为仅渲染到画布的该部分
          const positionYUpBottom = canvasRect.height - bottom;
          renderer.setScissor(left, positionYUpBottom, width, height);
          renderer.setViewport(left, positionYUpBottom, width, height);
          return width / height;
        }
      };

      const render = () => {
        if (leftCamera && rightCamera && sceneRef.current) {
          let sceneBackground = sceneRef.current.background as THREE.Color;
          // 渲染左侧的镜头
          const leftAspect = setScissorForElement(leftViewRef.current!);

          leftCamera.aspect = leftAspect!;
          leftCamera.updateProjectionMatrix();
          helper.update();
          helper.visible = true;
          sceneBackground.set(0x000000);
          renderer.render(sceneRef.current, leftCamera);

          // 渲染右侧的镜头
          sceneBackground = sceneRef.current.background as THREE.Color;
          const rightAspect = setScissorForElement(rightViewRef.current!);
          rightCamera.aspect = rightAspect!;
          rightCamera.updateProjectionMatrix();
          helper.visible = true;
          sceneBackground.set(0x000004);
          renderer.render(sceneRef.current, rightCamera);

          requestAnimationFrame(render);
        }
      };
      requestAnimationFrame(render);
      const handleResize = () => {
        if (sceneRef.current && canvasRef.current) {
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          renderer.setSize(width, height, false);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef]);
  return (
    <div className="full-screen con">
      <div className="split">
        <div ref={leftViewRef}></div>
        <div ref={rightViewRef}></div>
      </div>
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
};

export default Index;
