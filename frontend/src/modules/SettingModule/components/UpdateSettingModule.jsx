
import { Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import UpdateSettingForm from './UpdateSettingForm';

export default function UpdateSettingModule({
  config,
  children,
  withUpload = false,
  uploadSettingKey = null,
}) {
  return (
    <>
      <PageHeader
        title={config.SETTINGS_TITLE}
        ghost={false}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Divider></Divider>
      <UpdateSettingForm
        config={config}
        withUpload={withUpload}
        uploadSettingKey={uploadSettingKey}
      >
        {children}
      </UpdateSettingForm>
    </>
  );
}
