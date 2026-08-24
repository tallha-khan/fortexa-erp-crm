import useLanguage from '@/locale/useLanguage';
import { Layout, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';
import BrandLockup from '@/components/BrandLockup';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content className="authFormInner">
        <div className="hidden-lg hidden-md" style={{ marginBottom: 24 }}>
          <BrandLockup compact />
        </div>
        <Title level={2} style={{ marginBottom: 4 }}>
          {translate(AUTH_TITLE)}
        </Title>
        <p className="authFormLead">
          {isForRegistre
            ? 'Create your Fortexa workspace in a minute.'
            : 'Sign in to continue to your Fortexa workspace.'}
        </p>
        <div className="site-layout-content">{authContent}</div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
