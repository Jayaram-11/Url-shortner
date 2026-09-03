// Dashboard page (protected)
// Section 1: Top 5 URLs by click count (from /dashboard endpoint)
// Section 2: All user URLs (from /my-urls endpoint)
//
// Both tables have a "QR Code" column with a "View" button.
// Clicking "View" opens a modal showing the QR code image.
//
// NOTE: /my-urls does NOT return click_count, so "My Links" table
//       does not include a click count column.

import { useState, useEffect } from "react";
import { getDashboard, getMyUrls } from "../services/api";
import LinkTable from "../components/LinkTable";
import QrModal from "../components/QrModal";
import Loader from "../components/Loader";

// Columns for the Top 5 dashboard table (includes click_count from /dashboard)
const dashboardColumns = [
  { key: "original_url", label: "Original URL" },
  { key: "custom_code", label: "Short Code" },
  { key: "custom_url", label: "Short Link" },
  { key: "click_count", label: "Click Count" },
  { key: "created_at", label: "Created At" },
];

// Columns for My Links table (/my-urls does not return click_count)
const myUrlsColumns = [
  { key: "original_url", label: "Original URL" },
  { key: "custom_url", label: "Short URL" },
  { key: "custom_code", label: "Short Code" },
  { key: "created_at", label: "Created At" },
];

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [topUrls, setTopUrls] = useState([]);
  const [myUrls, setMyUrls] = useState([]);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [myUrlsLoading, setMyUrlsLoading] = useState(true);

  const [dashboardError, setDashboardError] = useState("");
  const [myUrlsError, setMyUrlsError] = useState("");

  // QR modal state — stores the custom_code of the row whose "View" was clicked
  const [activeQrCode, setActiveQrCode] = useState(null);

  // Fetch top 5 URLs from /dashboard
  useEffect(() => {
    async function fetchDashboard() {
      const res = await getDashboard();
      setDashboardLoading(false);
      if (res.ok) {
        setUserName(res.data.data.name);
        setTopUrls(res.data.data.dashboard);
      } else {
        const code = res.data?.detail?.error?.code;
        if (code === "NOT_FOUND") {
          setTopUrls([]);
        } else {
          setDashboardError("Failed to load dashboard data.");
        }
      }
    }
    fetchDashboard();
  }, []);

  // Fetch all user URLs from /my-urls
  useEffect(() => {
    async function fetchMyUrls() {
      const res = await getMyUrls();
      setMyUrlsLoading(false);
      if (res.ok) {
        setMyUrls(res.data.data);
      } else {
        const code = res.data?.detail?.error?.code;
        if (code === "NOT_FOUND") {
          setMyUrls([]);
        } else {
          setMyUrlsError("Failed to load your URLs.");
        }
      }
    }
    fetchMyUrls();
  }, []);

  return (
    <div className="page-content">
      {userName && <h2 className="welcome-text">Welcome, {userName}</h2>}

      {/* ── Top 5 URLs ── */}
      <section className="dashboard-section">
        <h2 className="section-title">Dashboard — Top 5 URLs</h2>
        {dashboardLoading && <p><Loader /></p>}
        {dashboardError && <p className="message message-error">{dashboardError}</p>}
        {!dashboardLoading && !dashboardError && (
          <LinkTable
            columns={dashboardColumns}
            rows={topUrls}
            onQrView={(customCode) => setActiveQrCode(customCode)}
          />
        )}
      </section>

      {/* ── My Links ── */}
      <section className="dashboard-section">
        <h2 className="section-title">My Links</h2>
        {myUrlsLoading && <p><Loader /></p>}
        {myUrlsError && <p className="message message-error">{myUrlsError}</p>}
        {!myUrlsLoading && !myUrlsError && (
          <LinkTable
            columns={myUrlsColumns}
            rows={myUrls}
            onQrView={(customCode) => setActiveQrCode(customCode)}
          />
        )}
      </section>

      {/* QR code modal — shown when any "View" button is clicked */}
      {activeQrCode && (
        <QrModal
          customCode={activeQrCode}
          onClose={() => setActiveQrCode(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
