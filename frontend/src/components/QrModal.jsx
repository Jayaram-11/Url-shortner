// QrModal - fetches and displays a QR code image in a centered overlay.
//
// Props:
//   customCode : the short/custom code for this URL (used to build the QR fetch URL)
//   onClose    : function to close the modal
//
// Why we fetch as a blob instead of using <img src={qr_url}>:
//   The backend constructs qr_url using its own DOMAIN env var, which may point
//   to localhost or a wrong address. By fetching directly via BASE_URL in api.js,
//   we always hit the correct deployed server.

import { useState, useEffect } from "react";
import { getQrCode } from "../services/api";

function QrModal({ customCode, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch the QR image as a blob when the modal opens
  useEffect(() => {
    let objectUrl = null;

    async function fetchQr() {
      setLoading(true);
      setError(false);
      const res = await getQrCode(customCode);
      setLoading(false);
      if (res.ok) {
        objectUrl = res.blobUrl;
        setBlobUrl(objectUrl);
      } else {
        setError(true);
      }
    }

    fetchQr();

    // Revoke the object URL when the modal closes to free memory
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [customCode]);

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
          {loading && <p className="qr-modal-status">Loading...</p>}
          {error && (
            <p className="qr-modal-status qr-modal-error">
              QR code could not be loaded.
            </p>
          )}
          {blobUrl && (
            <img
              src={blobUrl}
              alt="QR Code"
              className="qr-modal-image"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default QrModal;
