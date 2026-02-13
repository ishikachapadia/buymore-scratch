export default function ContestRulesModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
       <div className="modal-content-inner">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Contest Rules</h2>
        <div className="modal-body">
          <ol className="rules-list">
            <li>No purchase is necessary to enter or win.</li>
            <li>Must be 16+ or have guardian permission.</li>
            <li>Participants may play every 72 hours.</li>
            <li>Prizes are awarded at random and subject to availability.</li>
            <li>Selected winners must correctly answer a skill-testing question to receive their prize.</li>
            <li>BuyMore Dollars reserves the right to verify eligibility and disqualify any entry that does not comply with these rules.</li>
          </ol>
        </div>
       </div>
      </div>
    </div>
  );
}
