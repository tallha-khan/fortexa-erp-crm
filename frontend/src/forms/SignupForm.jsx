import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function SignupForm() {
  const translate = useLanguage();
  
  return (
    <div>
      <Form.Item
        label={translate('Name')}
        name="name"
        rules={[
          {
            required: true,
            message: translate('Please input your name'),
          },
          {
            min: 2,
            message: translate('Name must be at least 2 characters'),
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={translate('Enter your full name')}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
            message: translate('Please input your email'),
          },
          {
            type: 'email',
            message: translate('Please enter a valid email'),
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder={translate('Enter your email address')}
          type="email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('Password')}
        name="password"
        rules={[
          {
            required: true,
            message: translate('Please input your password'),
          },
          {
            min: 6,
            message: translate('Password must be at least 6 characters'),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={translate('Enter your password')}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('Confirm Password')}
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: translate('Please confirm your password'),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(translate('Passwords do not match')));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={translate('Confirm your password')}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span>{translate('Already have an account?')} </span>
          <a href="/login">{translate('Sign in')}</a>
        </div>
      </Form.Item>
    </div>
  );
}