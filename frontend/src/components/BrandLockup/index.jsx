import fortexaMark from '@/style/images/fortexa-mark.svg';

export default function BrandLockup({ inverted = false, compact = false }) {
  return (
    <div className={`brandLockup ${inverted ? 'is-inverted' : ''} ${compact ? 'is-compact' : ''}`}>
      <img src={fortexaMark} alt="Fortexa" className="brandMark" />
      <div className="brandCopy">
        <span className="brandName">Fortexa</span>
        <span className="brandHint">ERP · CRM</span>
      </div>
    </div>
  );
}
