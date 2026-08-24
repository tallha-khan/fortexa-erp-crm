import { Statistic, Progress, Divider, Row, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();
  return (
    <Row className="gutter-row">
      <div className="panelCard" style={{ height: 458, width: '100%' }}>
        <div
          className="pad20"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ color: '#0f172a', marginBottom: 40, marginTop: 15, fontSize: 'large' }}>
            {translate('Customers')}
          </h3>

          {isLoading ? (
            <Spin />
          ) : (
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <Progress type="dashboard" percent={newCustomer} size={148} strokeColor="#0e7c72" />
              <p>{translate('New Customer this Month')}</p>
              <Divider />
              <Statistic
                title={translate('Active Customer')}
                value={activeCustomer}
                precision={0}
                valueStyle={{ color: '#0e7c72' }}
                prefix={
                  activeCustomer > 0 ? (
                    <ArrowUpOutlined />
                  ) : activeCustomer < 0 ? (
                    <ArrowDownOutlined />
                  ) : null
                }
                suffix="%"
              />
            </div>
          )}
        </div>
      </div>
    </Row>
  );
}
