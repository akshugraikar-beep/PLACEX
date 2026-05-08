import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Copy, Check, Users, Clock, Link2, Phone,
  ArrowLeft, Share2, RefreshCw, ExternalLink, Shield,
} from "lucide-react";

// ── Utility ──────────────────────────────────────────────────────────────────
const randomId = () =>
  "PlaceX-" + Math.random().toString(36).slice(2, 7) + "-" + Date.now().toString(36);

// ── Small components ──────────────────────────────────────────────────────────
const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: copied ? "rgba(16,185,129,0.15)" : "rgba(124,58,237,0.15)",
        border: copied ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(124,58,237,0.3)",
        color: copied ? "#34d399" : "#a78bfa",
      }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : label}
    </button>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const VideoCallPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Room ID from URL param or generate a new one
  const [roomId] = useState(() => searchParams.get("room") || randomId());
  const [callStarted, setCallStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [apiError, setApiError] = useState(null);

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const timerRef = useRef(null);

  const domain = "meet.jit.si";
  const roomUrl = `https://${domain}/${roomId}`;
  // Detect which portal we are in
  const portalBase = window.location.pathname.startsWith("/dashboard/hr")
    ? "/dashboard/hr"
    : window.location.pathname.startsWith("/dashboard/company")
    ? "/dashboard/company"
    : "/dashboard/employee";
  const shareUrl = `${window.location.origin}${portalBase}/video-call?room=${roomId}`;

  // ── Load Jitsi script once ────────────────────────────────────────────────
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) { setScriptLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setApiError("Failed to load Jitsi SDK. Check your internet connection.");
    document.head.appendChild(script);
    return () => { /* script stays in head for reuse */ };
  }, []);

  // ── Start call ────────────────────────────────────────────────────────────
  const startCall = () => {
    if (!scriptLoaded || !window.JitsiMeetExternalAPI) {
      setApiError("Jitsi Meet SDK not loaded yet. Please wait a moment and try again.");
      return;
    }
    if (!jitsiContainerRef.current) return;

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const displayName =
      userData?.companyName || userData?.firstName || userData?.name || "HR Manager";

    try {
      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName: roomId,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          DEFAULT_REMOTE_DISPLAY_NAME: "Candidate",
          APP_NAME: "PlaceX Interview",
          NATIVE_APP_NAME: "PlaceX",
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "desktop", "fullscreen",
            "fodeviceselection", "hangup", "chat", "raisehand",
            "videoquality", "tileview", "select-background",
          ],
        },
        userInfo: { displayName, email: userData?.email || "" },
      });

      jitsiApiRef.current.addEventListener("readyToClose", () => {
        setCallStarted(false);
        clearInterval(timerRef.current);
        jitsiApiRef.current?.dispose();
        jitsiApiRef.current = null;
        if (jitsiContainerRef.current) jitsiContainerRef.current.innerHTML = "";
      });

      setCallStarted(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
    } catch (err) {
      setApiError("Could not start call: " + err.message);
    }
  };

  // ── End call ─────────────────────────────────────────────────────────────
  const endCall = () => {
    jitsiApiRef.current?.executeCommand("hangup");
    jitsiApiRef.current?.dispose();
    jitsiApiRef.current = null;
    if (jitsiContainerRef.current) jitsiContainerRef.current.innerHTML = "";
    clearInterval(timerRef.current);
    setCallStarted(false);
    setElapsed(0);
  };

  useEffect(() => () => { clearInterval(timerRef.current); endCall(); }, []);

  // ── Format timer ──────────────────────────────────────────────────────────
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="hr-page" style={{ minHeight: "100vh" }}>
      {/* ── Back button ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm hr-text-secondary hover:text-violet-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="hr-text-muted">•</span>
        <span className="text-sm hr-text-muted">Video Interview</span>
      </div>

      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold hr-text-primary flex items-center gap-2">
              <Video className="w-6 h-6 text-violet-400" />
              Video Interview Room
            </h1>
            <p className="hr-text-secondary text-sm mt-1">
              Powered by Jitsi Meet — free, secure, no account required
            </p>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-3">
            {callStarted ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Clock className="w-3.5 h-3.5" />
                {fmt(elapsed)}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
                <Shield className="w-3.5 h-3.5" />
                Ready to start
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Video area ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="xl:col-span-2">
          <div className="hr-card overflow-hidden" style={{ minHeight: 520 }}>

            {/* Jitsi container */}
            <div
              ref={jitsiContainerRef}
              style={{ height: callStarted ? 520 : 0, transition: "height 0.3s ease" }}
            />

            {/* Pre-call lobby */}
            <AnimatePresence>
              {!callStarted && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-6 p-10"
                  style={{ minHeight: 520 }}
                >
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}>
                    <Video className="w-12 h-12 text-white" />
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold hr-text-primary mb-2">Interview Room Ready</h2>
                    <p className="hr-text-secondary text-sm">
                      Click "Start Interview" to open the video call.<br />
                      Share the invite link below with your candidate.
                    </p>
                  </div>

                  {apiError && (
                    <div className="px-4 py-3 rounded-xl text-sm text-red-300 text-center"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", maxWidth: 400 }}>
                      {apiError}
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={startCall}
                      disabled={!scriptLoaded}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
                    >
                      <Video className="w-4 h-4" />
                      {scriptLoaded ? "Start Interview" : "Loading SDK…"}
                    </button>
                    <a
                      href={roomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition"
                      style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}
                    >
                      <ExternalLink className="w-4 h-4" /> Open in New Tab
                    </a>
                  </div>

                  <p className="text-xs hr-text-muted text-center">
                    🔒 End-to-end encrypted · No account needed · Free forever
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-call end button */}
            {callStarted && (
              <div className="flex justify-center p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={endCall}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
                  style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", boxShadow: "0 0 16px rgba(220,38,38,0.4)" }}
                >
                  <Phone className="w-4 h-4 rotate-[135deg]" /> End Interview
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Right panel ── */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col gap-4">

          {/* Room Info */}
          <div className="hr-card p-5">
            <h3 className="font-semibold hr-text-primary text-sm mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-violet-400" /> Room Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs hr-text-muted mb-1">Room ID</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}>
                  <span className="text-xs font-mono hr-text-secondary truncate mr-2">{roomId}</span>
                  <CopyButton text={roomId} label="Copy" />
                </div>
              </div>

              <div>
                <p className="text-xs hr-text-muted mb-1">Candidate Invite Link</p>
                <div className="px-3 py-2 rounded-lg mb-2"
                  style={{ background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}>
                  <span className="text-xs font-mono hr-text-secondary break-all">{shareUrl}</span>
                </div>
                <CopyButton text={shareUrl} label="Copy invite link" />
              </div>

              <div>
                <p className="text-xs hr-text-muted mb-1">Direct Jitsi Link</p>
                <div className="px-3 py-2 rounded-lg mb-2"
                  style={{ background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}>
                  <span className="text-xs font-mono hr-text-secondary break-all">{roomUrl}</span>
                </div>
                <CopyButton text={roomUrl} label="Copy Jitsi link" />
              </div>
            </div>
          </div>

          {/* New Room */}
          <div className="hr-card p-5">
            <h3 className="font-semibold hr-text-primary text-sm mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-violet-400" /> New Room
            </h3>
            <p className="text-xs hr-text-muted mb-4">
              Create a fresh room with a new unique ID for a different candidate.
            </p>
            <button
              onClick={() => {
                const id = randomId();
                navigate(`/dashboard/employee/video-call?room=${id}`);
                window.location.reload();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate New Room
            </button>
          </div>

          {/* Share options */}
          <div className="hr-card p-5">
            <h3 className="font-semibold hr-text-primary text-sm mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-violet-400" /> Share with Candidate
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Copy Email Template",
                  text: `Hi,\n\nYou've been invited for a video interview at PlaceX.\n\nJoin here: ${shareUrl}\n\nRoom ID: ${roomId}\n\nBest regards,\nHR Team — PlaceX`,
                },
                {
                  label: "Copy WhatsApp Message",
                  text: `Hi! You're invited for a PlaceX video interview. Join here: ${shareUrl}`,
                },
              ].map(({ label, text }) => (
                <CopyButton key={label} text={text} label={label} />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="hr-card p-5">
            <h3 className="font-semibold hr-text-primary text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" /> Features
            </h3>
            <ul className="space-y-2 text-xs hr-text-secondary">
              {[
                "✅ HD Video & Audio",
                "✅ Screen Sharing",
                "✅ In-call Chat",
                "✅ Raise Hand",
                "✅ Background Blur",
                "✅ Recording (self-hosted)",
                "✅ No time limit",
                "✅ Completely Free",
              ].map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCallPage;
