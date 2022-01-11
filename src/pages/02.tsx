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
  const resizeHandleRef = useRef<() => void>();
  useEffect(() => {
    if (canvasRef.current) {
      // 创建渲染器
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });
      // 创建镜头
      // perspective
      //PerspectiveCamera() 中的 4 个参数分别为：
      //1、fov(field of view 的缩写)，可选参数，默认值为 50，指垂直方向上的角度，注意该值是度数而不是弧度
      //2、aspect，可选参数，默认值为 1，画布的宽高比(宽/高)，例如画布宽300像素，高150像素，那么意味着宽高比为 2
      //3、near，可选参数，默认值为 0.1，近平面，限制摄像机可绘制最近的距离，若小于该距离则不会绘制(相当于被裁切掉)
      //4、far，可选参数，默认值为 2000，远平面，限制摄像机可绘制最远的距离，若超出该距离则不会绘制(相当于被裁切掉)
      //以上 4 个参数在一起，构成了一个 “视椎”，关于视椎的概念理解，暂时先不作详细描述。
      const camera = new PerspectiveCamera(75, 2, 0.1, 5);

      // 创建场景
      const scene = new Scene();
      const geometry = new BoxGeometry(1, 1, 1);
      //创建材质
      //我们需要让立方体能够反射光，所以不使用MeshBasicMaterial，而是改用MeshPhongMaterial
      const material1 = new MeshPhongMaterial({ color: 0x44aa88 });
      const material2 = new MeshPhongMaterial({ color: 0x44aa88 });
      const material3 = new MeshPhongMaterial({ color: 0x44aa88 });

      // 创建网格
      const cube1 = new Mesh(geometry, material1);
      cube1.position.x = -2;
      scene.add(cube1);
      const cube2 = new Mesh(geometry, material2);
      cube2.position.x = 0;
      scene.add(cube2);
      const cube3 = new Mesh(geometry, material3);
      cube3.position.x = 2;
      scene.add(cube3);
      const cubes = [cube1, cube2, cube3];

      // 创建光源
      const light = new DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
      scene.add(light);
      //将光源添加到场景中，若场景中没有任何光源，则可反光材质的物体渲染出的结果是一片漆黑，什么也看不见

      //设置透视镜头的Z轴距离，以便我们以某个距离来观察几何体
      //之前初始化透视镜头时，设置的近平面为 0.1，远平面为 5
      //因此 camera.position.z 的值一定要在 0.1 - 5 的范围内，超出这个范围则画面不会被渲染
      camera.position.z = 2;
      // renderer.render(scene, camera);

      const render = (time: number) => {
        time = time * 0.001; //原本 time 为毫秒，我们这里对 time 进行转化，修改成 秒，以便于我们动画旋转角度的递增
        // cube.rotation.x = time;
        // cube.rotation.y = time;
        // cube.rotation.z = time;

        // 放到resize的函数中
        // 目前存在的问题：
        // 可以观察到 canvase 是被硬生生由原本的 高150、像素 宽 300 像素给硬生生拉伸成 100%。 所以立方体出现了 扭曲、模糊、锯齿。 那我们继续修改代码。
        // 让镜头宽高比跟随着 canvase 宽高比，确保立方体不变形
        // 获取元素
        // const canvas = renderer.domElement;
        // // 设置宽高比
        // camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // // 通知镜头更新视椎(视野)
        // camera.updateProjectionMatrix();

        // // 第4步立方体已经不再变形，但是依然模糊，锯齿感比较明显。原因是渲染器(renderer) 渲染出的画面尺寸小于实际网页 canvas 尺寸。
        // renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        // //第3个参数为可选参数，默认值为 true，false 意思是阻止因渲染内容尺寸发生变化而去修改 canvas 尺寸

        cubes.map((cube) => {
          cube.rotation.x = time;
          // cube.rotation.y = time;
        });
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      // 添加事件
      const handleResize = () => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };

      handleResize(); //默认打开时，即重新触发一次

      resizeHandleRef.current = handleResize; //将 resizeHandleRef.current 与 useEffect() 中声明的函数进行绑定
      // window.addEventListener('resize', handleResize); //添加窗口 resize 事件处理函数
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvasRef.current);
      return () => {
        if (resizeHandleRef && resizeHandleRef.current) {
          // window.removeEventListener('resize', resizeHandleRef.current);
          resizeObserver.disconnect();
        }
      };
    }
  }, [canvasRef]);
  return <canvas ref={canvasRef} className="full-screen" />;
}
