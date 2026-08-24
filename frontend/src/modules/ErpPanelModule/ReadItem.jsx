import { useState, useEffect } from 'react';
import { Divider } from 'antd';

import { Button, Row, Col, Descriptions, Statistic, Tag, Select } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney, useDate } from '@/settings';
import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';
import { request } from '@/request';
import { tagColor } from '@/utils/statusTagColor';

const Item = ({ item, currentErp }) => {
  const { moneyFormatter } = useMoney();
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={11}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.itemName}</strong>
        </p>
        <p>{item.description}</p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {moneyFormatter({ amount: item.price, currency_code: currentErp.currency })}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {moneyFormatter({ amount: item.total, currency_code: currentErp.currency })}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { moneyFormatter } = useMoney();
  const { send, isLoading: mailInProgress } = useMail({ entity });

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});

  useEffect(() => {
    if (currentResult) {
      const { items, invoice, ...others } = currentResult;

      if (items) {
        setItemsList(items);
        setCurrentErp(currentResult);
      } else if (invoice.items) {
        setItemsList(invoice.items);
        setCurrentErp({ ...invoice.items, ...others, ...invoice });
      }
    }
    return () => {
      setItemsList([]);
      setCurrentErp(resetErp);
    };
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  const isQuote = entity === 'quote';
  const isInvoice = entity === 'invoice';
  const statusOptions = isQuote
    ? ['draft', 'pending', 'sent', 'accepted', 'declined', 'cancelled']
    : ['draft', 'pending', 'sent', 'cancelled', 'on hold', 'refunded'];

  const handleStatusChange = async (status) => {
    const data = await request.updateStatus({
      entity,
      id: currentErp._id,
      jsonData: { status },
    });
    if (data?.success && data.result) {
      setCurrentErp(data.result);
      dispatch(erp.currentItem({ data: data.result }));
    }
  };

  const statusTag = (value) => {
    if (!value) return null;
    const meta = tagColor(value);
    return (
      <Tag color={meta.color || 'default'} key={value}>
        {translate(meta.label || value)}
      </Tag>
    );
  };

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
        ghost={false}
        tags={[
          statusTag(currentErp.status),
          isInvoice && statusTag(currentErp.paymentStatus),
          isQuote && currentErp.converted && (
            <Tag color="green" key="converted">
              {translate('Converted')}
            </Tag>
          ),
        ]}
        extra={[
          <Button
            key="close"
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key="pdf"
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
          >
            {translate('Download PDF')}
          </Button>,
          <Button
            key="mail"
            loading={mailInProgress}
            onClick={() => {
              send(currentErp._id);
            }}
            icon={<MailOutlined />}
          >
            {translate('Send by Email')}
          </Button>,
          isQuote && !currentErp.converted && (
            <Button
              key="convert"
              onClick={async () => {
                const data = await request.convert({ entity, id: currentErp._id });
                if (data?.success && data.result?._id) {
                  navigate(`/invoice/read/${data.result._id}`);
                }
              }}
              icon={<RetweetOutlined />}
            >
              {translate('Convert to Invoice')}
            </Button>
          ),
          isInvoice && currentErp.paymentStatus !== 'paid' && (
            <Button
              key="pay"
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => {
                dispatch(erp.currentItem({ data: currentErp }));
                navigate(`/invoice/pay/${currentErp._id}`);
              }}
            >
              {translate('Record Payment')}
            </Button>
          ),
          <Button
            key="edit"
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type={isInvoice && currentErp.paymentStatus !== 'paid' ? 'default' : 'primary'}
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                {translate('Status')}
              </div>
              <Select
                value={currentErp.status}
                style={{ width: 180 }}
                onChange={handleStatusChange}
                options={statusOptions.map((value) => ({
                  value,
                  label: translate(value),
                }))}
              />
            </div>
          </Col>
          {isInvoice && (
            <Statistic
              title={translate('Payment')}
              value={translate(currentErp.paymentStatus || 'unpaid')}
              style={{ margin: '0 32px' }}
            />
          )}
          <Statistic
            title={translate('SubTotal')}
            value={moneyFormatter({
              amount: currentErp.subTotal,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Total')}
            value={moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            style={{
              margin: '0 32px',
            }}
          />
          {isInvoice && (
            <Statistic
              title={translate('Paid')}
              value={moneyFormatter({
                amount: currentErp.credit,
                currency_code: currentErp.currency,
              })}
              style={{
                margin: '0 32px',
              }}
            />
          )}
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Client : ${currentErp.client.name}`}>
        <Descriptions.Item label={translate('Address')}>{client.address}</Descriptions.Item>
        <Descriptions.Item label={translate('email')}>{client.email}</Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>{client.phone}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={11}>
          <p>
            <strong>{translate('Product')}</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>{translate('Price')}</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>{translate('Quantity')}</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>{translate('Total')}</strong>
          </p>
        </Col>
        <Divider />
      </Row>
      {itemslist.map((item) => (
        <Item key={item._id} item={item} currentErp={currentErp}></Item>
      ))}
      <div
        style={{
          width: '300px',
          float: 'right',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>{translate('Sub Total')} :</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.subTotal, currency_code: currentErp.currency })}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {translate('Tax Total')} ({currentErp.taxRate} %) :
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.taxTotal, currency_code: currentErp.currency })}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{translate('Total')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
