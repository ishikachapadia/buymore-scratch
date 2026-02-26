import React from "react";

export default function RememberUserModal({ userName, onLogin, onSwitch, open }) {
  if (!open) return null;
  return (
    <div className="remember-modal-overlay">
      <div className="remember-modal">
        <h2>Is this you?</h2>
        <p>Welcome back, <b>{userName}</b>!</p>
        <div className="remember-modal-actions">
          <button className="remember-modal-login" onClick={onLogin}>Log in as {userName}</button>
          <button className="remember-modal-switch" onClick={onSwitch}>Switch Account</button>
        </div>
      </div>
    </div>
  );
}
