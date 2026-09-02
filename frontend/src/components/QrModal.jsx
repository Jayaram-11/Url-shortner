// QrModal - displays a QR code image in a centered overlay.
// Props:
//   qrUrl  : full URL to the QR code PNG (from backend's qr_url field)
//   onClose: function to close the modal

function QrModal({ qrUrl, onClose }) {
  // Close when clicking the backdrop (outside the modal box)
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="qr-modal-backdrop" onClick={handleBackdropClick}>
      <div className="qr-modal-box">
        <div className="qr-modal-header">
          <span className="qr-modal-title">QR Code</span>
          <button className="qr-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="qr-modal-body">
          <img
            src={qrUrl}
            alt="QR Code"
            className="qr-modal-image"
          />
        </div>
      </div>
    </div>
  );
}

export default QrModal;
