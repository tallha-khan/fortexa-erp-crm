import BrandLockup from '@/components/BrandLockup';

const About = () => {
  return (
    <div>
      <div className="aboutHero">
        <BrandLockup inverted />
        <h1 style={{ marginTop: 24 }}>Fortexa ERP CRM</h1>
        <p style={{ maxWidth: 640, fontWeight: 500 }}>
          A modern operating system for invoices, quotes, payments, and customer records. Built to
          look production-ready — the kind of product you can put on LinkedIn with confidence.
        </p>
      </div>
      <div className="aboutGrid">
        <div className="aboutCard">
          <h3>Finance</h3>
          <p>Create invoices and quotes, record payments, and keep tax and payment modes organized.</p>
        </div>
        <div className="aboutCard">
          <h3>Customers</h3>
          <p>Keep client records close to the documents you send them, without jumping between tools.</p>
        </div>
        <div className="aboutCard">
          <h3>Control</h3>
          <p>A live dashboard shows monthly totals, unpaid work, and recent activity at a glance.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
