import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'FORTEXA'}
      subTitle={translate('Know about us on official website of the comapny')}
      extra={
        <>
         
        </>
      }
    />
  );
};

export default About;
