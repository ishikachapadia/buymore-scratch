export default function ContestRulesModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Contest Rules</h2>
        <div className="modal-body">
          <ol className="rules-list">
            <li>Play once every 72 hours.</li>
            <li>Must be 16+ or have guardian permission.</li>
            <li>Fill out the entry form honestly.</li>
            <li>Winners will be chosen at random, and must answer a skill question.</li>
            <li>Non-winners get a $2 coupon (on $50+ at Raw-Cabbage-on-a-stick Hut).</li>
            <li>Contest runs for 3 weeks only.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
