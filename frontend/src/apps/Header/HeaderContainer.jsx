import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout } from 'antd';
import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { FILE_BASE_URL } from '@/config/serverApiConfig';
import useLanguage from '@/locale/useLanguage';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;
  const translate = useLanguage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: '#0e7c72',
            backgroundColor: currentAdmin?.photo ? 'transparent' : '#ccfbf1',
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: <Link to={'/profile'}>{translate('profile_settings')}</Link>,
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },
    {
      type: 'divider',
    },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

  return (
    <Header className="appHeader">
      <div className="headerWelcome">
        <p className="headerEyebrow">Fortexa workspace</p>
        <h2>
          {greeting}
          {currentAdmin?.name ? `, ${currentAdmin.name}` : ''}
        </h2>
      </div>
      <div className="headerMeta">
        <span className="headerChip">Live workspace</span>
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Avatar
            className="last"
            src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
            style={{
              color: '#0e7c72',
              backgroundColor: currentAdmin?.photo ? 'transparent' : '#ccfbf1',
              boxShadow: '0 8px 20px rgba(14, 124, 114, 0.18)',
              cursor: 'pointer',
            }}
            size="large"
          >
            {currentAdmin?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
}
