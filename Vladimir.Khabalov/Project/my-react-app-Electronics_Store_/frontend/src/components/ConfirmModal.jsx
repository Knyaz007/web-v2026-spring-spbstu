import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-btn cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;