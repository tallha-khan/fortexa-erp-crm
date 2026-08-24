import BrandLockup from '@/components/BrandLockup';

const features = [
  'Invoices, quotes, and payments in one workspace',
  'Live dashboard for cash flow and customers',
  'Clean records your team can trust',
];

export default function SideContent() {
  return (
    <div className="authBrandPanel">
      <div>
        <BrandLockup inverted />
        <div className="authBrandKicker">Business operating system</div>
        <h1 className="authBrandTitle">Run finance and customers from one polished workspace.</h1>
        <p className="authBrandLead">
          Fortexa is a modern ERP & CRM for invoicing, quotes, payments, and client management —
          built to look as sharp as the work you deliver.
        </p>
        <ul className="authFeatureList">
          {features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="authBrandFoot">Fortexa · ERP CRM · Portfolio ready</div>
    </div>
  );
}
