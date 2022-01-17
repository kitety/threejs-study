import useCreateScene from '@/hooks/use-create-scene';
import { useEffect, useRef, useState } from 'react';
import DatGUI, { DatButton } from 'react-dat-gui';
import './17.less';
// import "react-dat-gui/dist/index.css";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [date, setDate] = useState<any>({});
  const renderRef = useCreateScene(canvasRef);

  useEffect(() => {
    if (canvasRef.current) {
    }
  }, [canvasRef]);
  const handleGUIUpdate = (newDate: any) => {
    setDate(newDate);
  };

  const handleSaveClick = () => {
    //编写点击之后的代码

    if (canvasRef.current) {
      // renderRef.current?.();
      canvasRef.current.toBlob(
        (blob) => {
          console.log('blob: ', blob);
          var reader = new FileReader();
          reader.readAsDataURL(blob!);
          reader.onloadend = function () {
            var base64data = reader.result;
            console.log(base64data);
          };
        },
        'image/jpeg',
        0.8,
      );
    }
  };

  return (
    <div className="full-screen">
      <canvas ref={canvasRef} className="full-screen" />
      <DatGUI data={date} onUpdate={handleGUIUpdate} className="dat-gui">
        <DatButton label="点击保存画布快照" onClick={handleSaveClick} />
      </DatGUI>
    </div>
  );
};

export default Index;
