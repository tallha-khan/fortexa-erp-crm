import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, notification } from 'antd';

import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import SignupForm from '@/forms/SignupForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const SignupPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  const onFinish = (values) => {
    // Remove confirmPassword field before sending to API
    const { confirmPassword, ...registerData } = values;
    dispatch(register({ registerData }));
  };

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: translate('Registration Successful'),
        description: translate('Please check your email to verify your account'),
      });
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [isSuccess, navigate, translate]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="signup_form"
          className="signup-form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <SignupForm />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
              loading={isLoading}
              size="large"
              style={{ width: '100%' }}
            >
              {translate('Create Account')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return (
    <AuthModule 
      authContent={<FormContainer />} 
      AUTH_TITLE="Create Account" 
      isForRegistre={true}
    />
  );
};

export default SignupPage;