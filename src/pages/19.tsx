import { loadDataFile } from '@/utils/loadDataFile';
import { useMount, useReactive, useRequest } from 'ahooks';
import { useEffect, useRef } from 'react';
import * as Three from 'three';

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

const PreserveDrawingBuffer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const state = useReactive({
    ascData: {} as ASCData,
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
      drawData(state.ascData);
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

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default PreserveDrawingBuffer;
// ![](https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220120201249.png)
