// UrlShortener page (protected)
// Top section: shorten a URL
// Operations section: three expandable cards
//   1. Customize Link
//   2. Delete URL
//   3. Update URL

import { useState } from "react";
import { shortenUrl, customizeUrl, deleteUrl, updateUrl } from "../services/api";
import DropdownCard from "../components/DropdownCard";
import Loader from "../components/Loader";

// ─── Shorten Section ────────────────────────────────────────────
function ShortenSection() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleShorten(e) {
    e.preventDefault();
    setResult("");
    setError("");
    setLoading(true);
    const res = await shortenUrl(url);
    setLoading(false);
    if (res.ok) {
      setResult(res.data.data.short_url);
    } else {
      setError("Failed to shorten URL. Please check the URL and try again.");
    }
  }

  return (
    <div className="shorten-box">
      <form onSubmit={handleShorten} className="form inline-form">
        <input
          id="shorten-input"
          className="form-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter URL"
        />
        <button
          id="shorten-btn"
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader /> : "Shorten URL"}
        </button>
      </form>
      {result && (
        <div className="result-box">
          <span className="result-label">Shortened Link:</span>
          <a href={result} target="_blank" rel="noopener noreferrer" className="result-url">
            {result}
          </a>
        </div>
      )}
      {error && <p className="message message-error">{error}</p>}
    </div>
  );
}

// ─── Customize Link Section ──────────────────────────────────────
function CustomizeSection() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCustomize(e) {
    e.preventDefault();
    setResult("");
    setError("");
    setLoading(true);
    const res = await customizeUrl(originalUrl, customCode);
    setLoading(false);
    if (res.ok) {
      setResult(res.data.data.custom_url);
    } else {
      const code = res.data?.detail?.error?.code;
      if (code === "CUSTOM_URL_EXIST") {
        setError("This custom code already exists. Please choose another.");
      } else if (code === "LENGTH_REQUIRED") {
        setError("Custom code length should be between 5 and 32.");
      } else {
        setError("Failed to create custom URL. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleCustomize} className="form">
      <label className="form-label" htmlFor="customize-original-url">
        Original URL
      </label>
      <input
        id="customize-original-url"
        className="form-input"
        type="url"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        required
        placeholder="Enter original URL"
      />
      <label className="form-label" htmlFor="customize-code">
        Custom Code
      </label>
      <input
        id="customize-code"
        className="form-input"
        type="text"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
        required
        placeholder="Enter custom code"
      />
      <button
        id="customize-btn"
        className="btn btn-primary"
        type="submit"
        disabled={loading}
      >
        {loading ? <Loader /> : "Customize"}
      </button>
      {result && (
        <div className="result-box">
          <span className="result-label">Customized Link:</span>
          <a href={result} target="_blank" rel="noopener noreferrer" className="result-url">
            {result}
          </a>
        </div>
      )}
      {error && <p className="message message-error">{error}</p>}
    </form>
  );
}

// ─── Delete URL Section ──────────────────────────────────────────
function DeleteSection() {
  const [customCode, setCustomCode] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const res = await deleteUrl(customCode);
    setLoading(false);

    // Check both HTTP status and the success flag in the response body
    if (res.ok && res.data?.success) {
      setIsError(false);
      setMessage("Deletion Successful");
      setCustomCode("");
    } else {
      setIsError(true);
      const errorCode = res.data?.detail?.error?.code;
      if (errorCode === "NOT_FOUND") {
        setMessage("Code does not exist");
      } else {
        setMessage("Code does not exist");
      }
    }
  }

  return (
    <form onSubmit={handleDelete} className="form">
      <label className="form-label" htmlFor="delete-code">
        Custom Code
      </label>
      <input
        id="delete-code"
        className="form-input"
        type="text"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
        required
        placeholder="Enter short code"
      />
      <button
        id="delete-btn"
        className="btn btn-danger"
        type="submit"
        disabled={loading}
      >
        {loading ? <Loader /> : "Delete"}
      </button>
      {message && (
        <p className={isError ? "message message-error" : "message message-success"}>
          {message}
        </p>
      )}
    </form>
  );
}

// ─── Update URL Section ──────────────────────────────────────────
function UpdateSection() {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const res = await updateUrl(oldCode, newCode);
    setLoading(false);
    if (res.ok) {
      setIsError(false);
      setMessage("Updated Successfully");
      setOldCode("");
      setNewCode("");
    } else {
      setIsError(true);
      const code = res.data?.detail?.error?.code;
      if (code === "CUSTOM_URL_EXIST") {
        setMessage("New code already exists. Choose a different one.");
      } else if (code === "LENGTH_REQUIRED") {
        setMessage("Custom code length should be between 5 and 32.");
      } else {
        setMessage("Code does not exist");
      }
    }
  }

  return (
    <form onSubmit={handleUpdate} className="form">
      <label className="form-label" htmlFor="update-old-code">
        Old Code
      </label>
      <input
        id="update-old-code"
        className="form-input"
        type="text"
        value={oldCode}
        onChange={(e) => setOldCode(e.target.value)}
        required
        placeholder="Enter old short code"
      />
      <label className="form-label" htmlFor="update-new-code">
        New Code
      </label>
      <input
        id="update-new-code"
        className="form-input"
        type="text"
        value={newCode}
        onChange={(e) => setNewCode(e.target.value)}
        required
        placeholder="Enter new short code"
      />
      <button
        id="update-btn"
        className="btn btn-success"
        type="submit"
        disabled={loading}
      >
        {loading ? <Loader /> : "Update"}
      </button>
      {message && (
        <p className={isError ? "message message-error" : "message message-success"}>
          {message}
        </p>
      )}
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
function UrlShortener() {
  return (
    <div className="page-content">

      {/* Hero text — centered above the input box */}
      <div className="shorten-hero">
        <h1 className="shorten-page-title">Create and Manage Short Links</h1>
        <p className="shorten-page-desc">
          Turn long URLs into short, shareable links in seconds.
          Create custom aliases, manage your links anytime, and
          track click statistics from your dashboard.
        </p>
      </div>

      {/* URL input box */}
      <ShortenSection />

      {/* Operations */}
      <div className="operations-section">
        <h2 className="section-title">Operations</h2>

        <DropdownCard title="Customize Link">
          <CustomizeSection />
        </DropdownCard>

        <DropdownCard title="Delete URL">
          <DeleteSection />
        </DropdownCard>

        <DropdownCard title="Update URL">
          <UpdateSection />
        </DropdownCard>
      </div>
    </div>
  );
}

export default UrlShortener;
