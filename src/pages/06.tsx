import React, { useEffect, useRef } from 'react';
import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';
const img1 =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220112171353.png';
const img2 =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220112171427.png';
const img3 =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220112171440.png';
const img4 =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220112171455.png';
const img5 =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220112171504.png';
const img6 =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220112171515.png';
const imgArr = [img1, img2, img3, img4, img5, img6];

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });

      const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
      camera.position.set(0, 0, 50);

      const scene = new Scene();
      scene.background = new Color(0xcccccc);

      // 创建一个纹理加载器
      const loader = new TextureLoader();
      //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
      const materialArr: MeshBasicMaterial[] = [];
      for (let i = 0; i < 6; i++) {
        materialArr.push(
          new MeshBasicMaterial({
            map: loader.load(
              imgArr[i],
              (texture) => {
                console.log('纹理图片加载完成');
                console.log(texture);
                console.log(texture.image.currentSrc); //此处即图片实际加载地址
              },
              (event) => {
                console.log('纹理图片加载中...');
                console.log(event);
              },
              (error) => {
                console.log('纹理图片加载失败！');
                console.log(error);
              },
            ),
          }),
        );
      }
      // const material = new MeshBasicMaterial({
      //   map: loader.load(
      //     'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20210226115624.png',
      //   ),
      // });

      const box = new BoxBufferGeometry(8, 8, 8);
      const mesh = new Mesh(box, materialArr);
      scene.add(mesh);

      const render = (time: number) => {
        time = time * 0.001;

        mesh.rotation.x = time;
        mesh.rotation.y = time;
        mesh.rotation.z = time;
        renderer.render(scene, camera);

        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      const resizeHandle = () => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };
      resizeHandle();
      window.addEventListener('resize', resizeHandle);

      return () => {
        window.removeEventListener('resize', resizeHandle);
      };
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Index;
