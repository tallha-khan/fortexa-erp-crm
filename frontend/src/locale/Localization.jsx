import { ConfigProvider } from 'antd';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0e7c72',
          colorLink: '#0e7c72',
          colorInfo: '#0e7c72',
          colorSuccess: '#0f766e',
          borderRadius: 12,
          fontFamily: 'Nunito, sans-serif',
          colorText: '#0f172a',
          colorBgLayout: '#f4f7fa',
          controlHeight: 40,
        },
        components: {
          Button: {
            controlHeight: 40,
            fontWeight: 700,
          },
          Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: 'transparent',
            darkItemHoverBg: 'rgba(255,255,255,0.06)',
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
