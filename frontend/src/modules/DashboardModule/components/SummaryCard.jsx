import { Col, Spin, Tooltip } from 'antd';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

export default function AnalyticSummaryCard({
  title,
  data,
  prefix,
  isLoading = false,
  icon,
  accent = '#0e7c72',
}) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const formatted = moneyFormatter({
    amount: data || 0,
    currency_code: money_format_settings?.default_currency_code,
  });

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 6 }}
    >
      <div className="kpiCard">
        <div className="kpiTop">
          <p className="kpiTitle">{title}</p>
          <span className="kpiIcon" style={{ background: `${accent}18`, color: accent }}>
            {icon}
          </span>
        </div>
        {isLoading ? (
          <Spin />
        ) : (
          <Tooltip title={formatted}>
            <p className="kpiValue">{formatted}</p>
          </Tooltip>
        )}
        <div className="kpiPrefix">{prefix}</div>
      </div>
    </Col>
  );
}
