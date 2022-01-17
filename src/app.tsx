import React from 'react';
import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import { RightContent } from '@ant-design/pro-layout/lib/components/TopNavHeader';
import Footer from '@ant-design/pro-layout/lib/Footer';
import styles from './app.module.less';

export const layout = (props): BasicLayoutProps => {
  return {
    logo: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/files/icon.svg',
    siderWidth: 208,
    navTheme: 'light',

    contentStyle: {
      height: 'calc(100vh - 48px)',
    },
    headerRender: () => <div className={styles.link}></div>,
  };
};
