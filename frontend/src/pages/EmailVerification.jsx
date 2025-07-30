import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import AuthModule from '@/modules/AuthModule';

const EmailVerification = () => {
  const { userId, emailToken } = useParams();
  const navigate = useNavigate();
  const translate = useLanguage();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify/${userId}/${emailToken}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccess(true);
        } else {
          setError(data.message || 'Verification failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && emailToken) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [userId, emailToken]);

  const VerificationContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px' }}>{translate('verifying_your_email')}</p>
        </div>
      );
    }

    if (success) {
      return (
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title={translate('email_verified_successfully')}
          subTitle={translate('your_account_has_been_activated')}
          extra={[
            <Button type="primary" key="login" onClick={() => navigate('/login')}>
              {translate('go_to_login')}
            </Button>,
          ]}
        />
      );
    }

    return (
      <Result
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        title={translate('verification_failed')}
        subTitle={error || translate('the_verification_link_is_invalid')}
        extra={[
          <Button type="primary" key="login" onClick={() => navigate('/login')}>
            {translate('go_to_login')}
          </Button>,
          <Button key="signup" onClick={() => navigate('/signup')}>
            {translate('sign_up_again')}
          </Button>,
        ]}
      />
    );
  };

  return (
    <AuthModule 
      authContent={<VerificationContent />} 
      AUTH_TITLE="Email Verification"
    />
  );
};

export default EmailVerification;