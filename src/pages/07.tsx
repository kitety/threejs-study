import { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  AmbientLightProbe,
  BoxBufferGeometry,
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  HemisphereLightProbe,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  PointLightHelper,
  RectAreaLight,
  Scene,
  SpotLight,
  SpotLightHelper,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import './07.less';

import { createScene, MaterialType } from './component/create-scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

enum LightType {
  AmbientLight = 'AmbientLight',
  AmbientLightProbe = 'AmbientLightProbe',
  DirectionalLight = 'DirectionalLight',
  HemisphereLight = 'HemisphereLight',
  HemisphereLightProbe = 'HemisphereLightProbe',
  PointLight = 'PointLight',
  RectAreaLight = 'RectAreaLight',
  SpotLight = 'SpotLight',
}

const buttonLabels = [
  LightType.AmbientLight,
  LightType.AmbientLightProbe,
  LightType.DirectionalLight,
  LightType.HemisphereLight,
  LightType.HemisphereLightProbe,
  LightType.PointLight,
  LightType.RectAreaLight,
  LightType.SpotLight,
];

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [type, setType] = useState<LightType>(LightType.AmbientLight);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });

      const camera = new PerspectiveCamera(45, 2, 0.1, 1000);
      camera.position.set(0, 10, 20);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 5, 0);
      controls.update();

      const scene = createScene();
      sceneRef.current = scene;

      const render = () => {
        if (sceneRef.current) {
          renderer.render(sceneRef.current, camera);
        }
      };
      window.requestAnimationFrame(render);

      const handleResize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current = null;
      let newScene: Scene;
      if (type === LightType.RectAreaLight) {
        newScene = createScene(MaterialType.MESH_STANDARD_MATERIAL);
      } else {
        newScene = createScene();
      }
      sceneRef.current = newScene;

      switch (type) {
        case LightType.AmbientLight:
          const ambientLight = new AmbientLight(0xffffff, 1);
          newScene.add(ambientLight);
          break;
        case LightType.AmbientLightProbe:
          const ambientLightProbe = new AmbientLightProbe(0xffffff, 1);
          newScene.add(ambientLightProbe);
          break;
        case LightType.DirectionalLight:
          const directionalLight = new DirectionalLight(0xffffff, 1);
          directionalLight.position.set(0, 10, 0);
          directionalLight.target.position.set(-5, 0, 0);
          newScene.add(directionalLight);
          newScene.add(directionalLight.target);

          const directionalLightHelper = new DirectionalLightHelper(
            directionalLight,
          );
          newScene.add(directionalLightHelper);
          break;
        case LightType.HemisphereLight:
          const hemisphereLight = new HemisphereLight(0xb1e1ff, 0xb97a20, 1);
          newScene.add(hemisphereLight);

          const hemisphereLightHelper = new HemisphereLightHelper(
            hemisphereLight,
            5,
          );
          newScene.add(hemisphereLightHelper);

          break;
        case LightType.HemisphereLightProbe:
          const hemisphereLightProbe = new HemisphereLightProbe(
            0xb1e1ff,
            0xb97a20,
            1,
          );
          newScene.add(hemisphereLightProbe);
          break;
        case LightType.PointLight:
          const pointLight = new PointLight(0xffffff, 1);
          pointLight.position.set(0, 10, 0);
          newScene.add(pointLight);

          const pointLightHelper = new PointLightHelper(pointLight);
          newScene.add(pointLightHelper);
          break;
        case LightType.RectAreaLight:
          //RectAreaLightUniformsLib.init() //实际测试时发现即使不添加这行代码，场景似乎也依然正常渲染，没有看出差异

          const rectAreaLight = new RectAreaLight(0xffffff, 5, 12, 4);
          rectAreaLight.position.set(0, 10, 0);
          rectAreaLight.rotation.x = MathUtils.degToRad(-90);
          newScene.add(rectAreaLight);

          const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
          newScene.add(rectAreaLightHelper);
          break;
        case LightType.SpotLight:
          const spotLight = new SpotLight(0xffffff, 1);
          spotLight.position.set(0, 10, 0);
          spotLight.target.position.set(-5, 0, 0);
          newScene.add(spotLight);
          newScene.add(spotLight.target);

          const spotLightHelper = new SpotLightHelper(spotLight);
          newScene.add(spotLightHelper);
          break;
        default:
          console.log('???');
          break;
      }
    }
  }, [type]);

  return (
    <div className="full-screen2">
      <div className="buttons">
        {buttonLabels.map((label, index) => {
          return (
            <button
              className={label === type ? 'button-selected' : ''}
              onClick={() => {
                setType(label);
              }}
              key={`button${index}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Index;
