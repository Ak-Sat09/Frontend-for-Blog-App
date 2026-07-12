import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";

/* ============================================================================
   DISPATCH — a small mail-room for one API endpoint.
   Views: Compose, Drafts, Templates, Contacts, Sent, Settings.
   Everything is wired to real state. Nothing here is decorative-only.
   ========================================================================== */

const API_URL = "https://appemail-latest.onrender.com/api/email/send";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAV_ITEMS = [
  { id: "compose", label: "Compose", icon: "compose" },
  { id: "drafts", label: "Drafts", icon: "drafts" },
  { id: "templates", label: "Templates", icon: "templates" },
  { id: "contacts", label: "Contacts", icon: "contacts" },
  { id: "sent", label: "Sent", icon: "sent" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const SEED_TEMPLATES = [
  {
    id: "tpl-interview",
    name: "Interview follow-up",
    subject: "Following up on our interview",
    body:
      "Hello,\n\nThank you for taking the time to speak with me. I enjoyed our conversation and remain very interested in the role.\n\nPlease let me know if there is any further information I can provide.\n\nBest regards,",
  },
  {
    id: "tpl-intro",
    name: "Cold introduction",
    subject: "Quick introduction",
    body:
      "Hello,\n\nMy name is — and I wanted to reach out directly. I think there could be a good fit here and would welcome the chance to talk further.\n\nLooking forward to hearing from you,",
  },
  {
    id: "tpl-thanks",
    name: "Thank you note",
    subject: "Thank you",
    body: "Hello,\n\nThank you again for your time and consideration. It meant a great deal.\n\nWarmly,",
  },
];

const SEED_CONTACTS = [
  { id: "c1", name: "Priya Sharma", email: "priya.sharma@example.com", group: "Recruiters" },
  { id: "c2", name: "Daniel Osei", email: "daniel.osei@example.com", group: "Hiring managers" },
  { id: "c3", name: "Anmol Mehla", email: "anmolmehla4@gmail.com", group: "Personal" },
];

/* ----------------------------- utilities --------------------------------- */

let idCounter = 0;
function uid(prefix = "id") {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function formatTime(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateStamp(d) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatRelative(d) {
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function fileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function wordCount(text) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/* -------------------------------- icons ----------------------------------- */

const ICON_PATHS = {
  compose: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z",
  drafts: "M4 4h16v16H4z M4 8h16 M9 12h6 M9 16h4",
  templates: "M4 4h7v7H4z M13 4h7v4h-7z M13 11h7v9h-7z M4 14h7v6H4z",
  contacts: "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2 M10 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  sent: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z",
  sun: "M12 3v2 M12 19v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4",
  sunCore: "M12 8a4 4 0 100 8 4 4 0 000-8z",
  moon: "M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35",
  plus: "M12 5v14 M5 12h14",
  trash: "M3 6h18 M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  edit: "M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  paperclip:
    "M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.19 9.19a2 2 0 01-2.83-2.83l8.49-8.48",
  clock: "M12 6v6l4 2 M12 22a10 10 0 100-20 10 10 0 000 20z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  arrowRight: "M5 12h14 M12 5l7 7-7 7",
  chevronDown: "M6 9l6 6 6-6",
  copy: "M9 9h11v11H9z M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h11a1 1 0 011 1v1",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z",
};

function Icon({ name, size = 16, className = "" }) {
  const d = ICON_PATHS[name];
  const extra = name === "sun" ? ICON_PATHS.sunCore : null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
      {extra && <path d={extra} fill="currentColor" stroke="none" />}
    </svg>
  );
}

/* -------------------------------- toasts ----------------------------------- */

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, tone = "success") => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  return { toasts, push, dismiss };
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          <Icon name={t.tone === "error" ? "x" : "check"} size={14} />
          <span>{t.message}</span>
          <button onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">
            <Icon name="x" size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- modal ------------------------------------ */

function ConfirmModal({ open, title, body, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-veil" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-seal-flat" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ chip input --------------------------------- */

function ChipInput({ chips, setChips, placeholder, dense = false }) {
  const [draft, setDraft] = useState("");

  const commit = useCallback(() => {
    const v = draft.trim().replace(/,$/, "");
    if (!v) return;
    setChips((c) => [...c, { id: uid("chip"), value: v, valid: EMAIL_RE.test(v) }]);
    setDraft("");
  }, [draft, setChips]);

  const onKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      if (draft.trim()) {
        e.preventDefault();
        commit();
      }
    } else if (e.key === "Backspace" && !draft && chips.length) {
      setChips((c) => c.slice(0, -1));
    }
  };

  const remove = (id) => setChips((c) => c.filter((x) => x.id !== id));

  return (
    <div className={classNames("chip-field", dense && "dense")}>
      {chips.map((c) => (
        <span className={classNames("chip", !c.valid && "invalid")} key={c.id}>
          {c.value}
          <button type="button" onClick={() => remove(c.id)} aria-label={`Remove ${c.value}`}>
            <Icon name="x" size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={chips.length ? "" : placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
      />
    </div>
  );
}

/* -------------------------------- sidebar ----------------------------------- */

function Sidebar({ active, onChange, theme, onToggleTheme, counts }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="sent" size={16} />
        </div>
        <div>
          <div className="brand-name">Dispatch</div>
          <div className="brand-sub">mail room</div>
        </div>
      </div>

      <nav className="nav-list">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={classNames("nav-item", active === item.id && "active")}
            onClick={() => onChange(item.id)}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
            {counts[item.id] > 0 && <span className="nav-count">{counts[item.id]}</span>}
          </button>
        ))}
      </nav>

      <button className="theme-toggle" onClick={onToggleTheme}>
        <Icon name={theme === "paper" ? "moon" : "sun"} size={14} />
        <span>{theme === "paper" ? "Switch to ink" : "Switch to paper"}</span>
      </button>
    </aside>
  );
}

/* ------------------------------ empty state --------------------------------- */

function EmptyState({ icon, title, body }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={22} />
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

/* ------------------------------- compose view -------------------------------- */

function ComposeView({
  compose,
  setCompose,
  contacts,
  templates,
  onSend,
  onSaveDraft,
  onSaveTemplate,
  sending,
  signature,
  signatureEnabled,
}) {
  const { toChips, ccChips, bccChips, subject, message, file } = compose;
  const [showCcBcc, setShowCcBcc] = useState(ccChips.length > 0 || bccChips.length > 0);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [templatePick, setTemplatePick] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const setField = (key) => (val) => setCompose((c) => ({ ...c, [key]: val }));

  const validTo = toChips.filter((c) => c.valid);
  const invalidAny = [...toChips, ...ccChips, ...bccChips].some((c) => !c.valid);
  const canSend = validTo.length > 0 && !invalidAny && subject.trim() && message.trim() && !sending;

  const applyTemplate = (id) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    setCompose((c) => ({ ...c, subject: tpl.subject, message: tpl.body }));
    setTemplatePick(id);
  };

  const addContact = (contact) => {
    setCompose((c) => ({
      ...c,
      toChips: c.toChips.some((ch) => ch.value === contact.email)
        ? c.toChips
        : [...c.toChips, { id: uid("chip"), value: contact.email, valid: true }],
    }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setField("file")(f);
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const finalMessage = signatureEnabled && signature.trim() ? `${message}\n\n${signature}` : message;
  const lines = message ? message.split("\n").length : 0;
  const words = wordCount(message);

  return (
    <div className="view compose-view">
      <div className="view-grid">
        <form
          ref={formRef}
          className="slip"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSend) onSend();
          }}
        >
          <div className="letterhead">
            <div>
              <h1>Compose</h1>
              <p>one recipient list, delivered as written</p>
            </div>
            <div className="postmark">
              <span>
                {formatDateStamp(new Date())}
                <br />
                OUTBOX
              </span>
            </div>
          </div>

          <div className="field-block">
            <div className="row">
              <label>To</label>
              <div className="to-row">
                <ChipInput
                  chips={toChips}
                  setChips={(fn) => setCompose((c) => ({ ...c, toChips: typeof fn === "function" ? fn(c.toChips) : fn }))}
                  placeholder="name@company.com, then Enter"
                />
                <div className="to-actions">
                  <button type="button" className="link-btn" onClick={() => setShowContactPicker((s) => !s)}>
                    <Icon name="users" size={12} /> Contacts
                  </button>
                  {!showCcBcc && (
                    <button type="button" className="link-btn" onClick={() => setShowCcBcc(true)}>
                      Cc / Bcc
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showContactPicker && (
              <div className="contact-popover">
                {contacts.length === 0 && <div className="muted-line">No saved contacts yet.</div>}
                {contacts.map((c) => (
                  <button type="button" key={c.id} className="contact-pop-row" onClick={() => addContact(c)}>
                    <span className="avatar-dot">{c.name.slice(0, 1)}</span>
                    <span className="cp-name">{c.name}</span>
                    <span className="cp-email">{c.email}</span>
                  </button>
                ))}
              </div>
            )}

            {invalidAny && (
              <div className="hint-line">One or more addresses look invalid — check the highlighted chip.</div>
            )}
          </div>

          {showCcBcc && (
            <>
              <div className="field-block">
                <div className="row">
                  <label>Cc</label>
                  <ChipInput
                    chips={ccChips}
                    setChips={(fn) => setCompose((c) => ({ ...c, ccChips: typeof fn === "function" ? fn(c.ccChips) : fn }))}
                    placeholder="optional"
                    dense
                  />
                </div>
              </div>
              <div className="field-block">
                <div className="row">
                  <label>Bcc</label>
                  <ChipInput
                    chips={bccChips}
                    setChips={(fn) => setCompose((c) => ({ ...c, bccChips: typeof fn === "function" ? fn(c.bccChips) : fn }))}
                    placeholder="optional"
                    dense
                  />
                </div>
              </div>
              <div className="hint-line quiet">
                The delivery API accepts a single address list, so Cc and Bcc are merged into To when sent.
              </div>
            </>
          )}

          <div className="field">
            <label>Subject</label>
            <input
              className="plain"
              type="text"
              placeholder="Interview opportunity"
              value={subject}
              onChange={(e) => setField("subject")(e.target.value)}
            />
          </div>

          <div className="letter-body">
            <div className="letter-body-head">
              <label>Message</label>
              <div className="body-meta">
                <select
                  className="template-select"
                  value={templatePick}
                  onChange={(e) => applyTemplate(e.target.value)}
                >
                  <option value="">Load template…</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <span className="count">
                  {words} words · {lines} lines
                </span>
              </div>
            </div>
            <textarea
              placeholder={"Hello,\n\nI hope you are doing well.\n\nRegards,"}
              value={message}
              onChange={(e) => setField("message")(e.target.value)}
            />
            {signatureEnabled && signature.trim() && (
              <div className="signature-preview">
                <Icon name="edit" size={11} /> Signature will be appended on send
              </div>
            )}
          </div>

          <div className="footer-row">
            <label
              className={classNames("attach", dragOver && "drag")}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <Icon name="paperclip" size={13} />
              {file ? `${file.name.slice(0, 20)} · ${fileSize(file.size)}` : "Attach file"}
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setField("file")(e.target.files[0] || null)}
              />
            </label>
            {file && (
              <button type="button" className="link-btn danger" onClick={() => setField("file")(null)}>
                Remove
              </button>
            )}

            <div className="footer-spacer" />

            <button
              type="button"
              className="btn-ghost"
              onClick={() => onSaveTemplate({ subject, body: message })}
              disabled={!subject.trim() || !message.trim()}
            >
              Save as template
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => onSaveDraft()}
              disabled={!subject.trim() && !message.trim() && toChips.length === 0}
            >
              Save draft
            </button>

            <button type="submit" className={classNames("seal-btn", sending && "sending")} disabled={!canSend} aria-label="Send dispatch">
              <span className="ring" />
              {sending ? <Icon name="clock" size={20} /> : <Icon name="sent" size={20} />}
            </button>
          </div>

          <div className="kbd-hint">
            <kbd>{navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"}</kbd> + <kbd>Enter</kbd> to send
          </div>
        </form>

        <aside className="preview-pane">
          <div className="preview-head">
            <Icon name="inbox" size={13} />
            <span>Live preview</span>
          </div>
          <div className="preview-card">
            <div className="preview-line">
              <span className="preview-label">To</span>
              <span>{validTo.length ? validTo.map((c) => c.value).join(", ") : "—"}</span>
            </div>
            <div className="preview-line">
              <span className="preview-label">Subject</span>
              <span>{subject || "—"}</span>
            </div>
            <div className="preview-divider" />
            <div className="preview-body">{finalMessage || "Your message will appear here as you type."}</div>
            {file && (
              <div className="preview-attachment">
                <Icon name="paperclip" size={12} /> {file.name}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------- drafts view -------------------------------- */

function DraftsView({ drafts, onResume, onDelete }) {
  if (drafts.length === 0) {
    return (
      <div className="view">
        <ViewHeader title="Drafts" subtitle="Saved compositions that have not been sent" />
        <EmptyState icon="drafts" title="No drafts yet" body="Save a message from Compose to find it here later." />
      </div>
    );
  }
  return (
    <div className="view">
      <ViewHeader title="Drafts" subtitle={`${drafts.length} saved`} />
      <div className="ledger">
        {drafts.map((d) => (
          <div className="ledger-row" key={d.id}>
            <div className="ledger-main">
              <div className="ledger-title">{d.subject || "(no subject)"}</div>
              <div className="ledger-sub">
                {d.toChips.length ? d.toChips.map((c) => c.value).join(", ") : "no recipients"} · saved{" "}
                {formatRelative(d.savedAt)}
              </div>
            </div>
            <div className="ledger-actions">
              <button className="btn-ghost sm" onClick={() => onResume(d)}>
                Resume
              </button>
              <button className="icon-btn danger" onClick={() => onDelete(d.id)} aria-label="Delete draft">
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ templates view -------------------------------- */

function TemplatesView({ templates, onDelete, onUse }) {
  return (
    <div className="view">
      <ViewHeader title="Templates" subtitle={`${templates.length} saved`} />
      <div className="card-grid">
        {templates.map((t) => (
          <div className="tpl-card" key={t.id}>
            <div className="tpl-card-head">
              <Icon name="templates" size={14} />
              <span>{t.name || t.subject}</span>
            </div>
            <div className="tpl-card-subject">{t.subject}</div>
            <p className="tpl-card-body">{t.body}</p>
            <div className="tpl-card-actions">
              <button className="btn-ghost sm" onClick={() => onUse(t)}>
                Use in compose
              </button>
              {!t.seeded && (
                <button className="icon-btn danger" onClick={() => onDelete(t.id)} aria-label="Delete template">
                  <Icon name="trash" size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- contacts view -------------------------------- */

function ContactsView({ contacts, setContacts, push }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.group || "").toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce((acc, c) => {
    const g = c.group || "Ungrouped";
    (acc[g] = acc[g] || []).push(c);
    return acc;
  }, {});

  const resetForm = () => {
    setName("");
    setEmail("");
    setGroup("");
    setEditingId(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !EMAIL_RE.test(email.trim())) {
      push("Enter a name and a valid email.", "error");
      return;
    }
    if (editingId) {
      setContacts((cs) => cs.map((c) => (c.id === editingId ? { ...c, name, email, group } : c)));
      push("Contact updated.");
    } else {
      setContacts((cs) => [...cs, { id: uid("contact"), name: name.trim(), email: email.trim(), group: group.trim() }]);
      push("Contact added.");
    }
    resetForm();
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setEmail(c.email);
    setGroup(c.group || "");
  };

  return (
    <div className="view">
      <ViewHeader title="Contacts" subtitle={`${contacts.length} saved`} />

      <form className="contact-form" onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Group (optional)" value={group} onChange={(e) => setGroup(e.target.value)} />
        <button type="submit" className="btn-seal-flat sm">
          <Icon name={editingId ? "check" : "plus"} size={13} />
          {editingId ? "Save" : "Add"}
        </button>
        {editingId && (
          <button type="button" className="btn-ghost sm" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="search-row">
        <Icon name="search" size={13} />
        <input placeholder="Search contacts" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 && (
        <EmptyState icon="contacts" title="No contacts found" body="Add someone above, or adjust your search." />
      )}

      {Object.entries(grouped).map(([g, list]) => (
        <div key={g} className="contact-group">
          <div className="contact-group-title">{g}</div>
          <div className="ledger">
            {list.map((c) => (
              <div className="ledger-row" key={c.id}>
                <span className="avatar-dot">{c.name.slice(0, 1)}</span>
                <div className="ledger-main">
                  <div className="ledger-title">{c.name}</div>
                  <div className="ledger-sub">{c.email}</div>
                </div>
                <div className="ledger-actions">
                  <button className="icon-btn" onClick={() => startEdit(c)} aria-label="Edit contact">
                    <Icon name="edit" size={13} />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={() => setContacts((cs) => cs.filter((x) => x.id !== c.id))}
                    aria-label="Delete contact"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- sent view ---------------------------------- */

function SentView({ history }) {
  const [query, setQuery] = useState("");
  const filtered = history.filter(
    (h) =>
      h.subject.toLowerCase().includes(query.toLowerCase()) ||
      h.to.join(",").toLowerCase().includes(query.toLowerCase())
  );

  if (history.length === 0) {
    return (
      <div className="view">
        <ViewHeader title="Sent" subtitle="Nothing dispatched yet this session" />
        <EmptyState icon="sent" title="No dispatches yet" body="Everything you send successfully will show up here." />
      </div>
    );
  }

  return (
    <div className="view">
      <ViewHeader title="Sent" subtitle={`${history.length} this session`} />
      <div className="search-row">
        <Icon name="search" size={13} />
        <input placeholder="Search sent dispatches" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="ledger">
        {filtered.map((h) => (
          <div className="ledger-row" key={h.id}>
            <span className="stamp-dot">
              <Icon name="check" size={12} />
            </span>
            <div className="ledger-main">
              <div className="ledger-title">{h.subject}</div>
              <div className="ledger-sub">
                To {h.to.length} recipient{h.to.length > 1 ? "s" : ""} · {h.to.join(", ")}
              </div>
            </div>
            <div className="ledger-time">
              {formatTime(h.sentAt)}
              <div className="ledger-time-sub">{formatRelative(h.sentAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- settings view -------------------------------- */

function SettingsView({ senderName, setSenderName, signature, setSignature, signatureEnabled, setSignatureEnabled, theme, onToggleTheme }) {
  return (
    <div className="view">
      <ViewHeader title="Settings" subtitle="Local to this session" />

      <div className="settings-card">
        <div className="settings-row">
          <div>
            <div className="settings-label">Display name</div>
            <div className="settings-help">Shown on the letterhead only. The delivery API does not take a from-name.</div>
          </div>
          <input
            className="settings-input"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">Theme</div>
            <div className="settings-help">Paper is a light letter surface on ink. Ink is a full dark room.</div>
          </div>
          <button className="btn-ghost sm" onClick={onToggleTheme}>
            <Icon name={theme === "paper" ? "moon" : "sun"} size={13} />
            {theme === "paper" ? "Use ink" : "Use paper"}
          </button>
        </div>

        <div className="settings-row column">
          <div className="settings-row-head">
            <div>
              <div className="settings-label">Signature</div>
              <div className="settings-help">Appended to the message body when enabled below.</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={signatureEnabled}
                onChange={(e) => setSignatureEnabled(e.target.checked)}
              />
              <span className="switch-track">
                <span className="switch-thumb" />
              </span>
            </label>
          </div>
          <textarea
            className="settings-textarea"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder={"Best,\nYour name"}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- view header -------------------------------- */

function ViewHeader({ title, subtitle }) {
  return (
    <div className="view-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

/* ----------------------------------- app -------------------------------------- */

const emptyCompose = () => ({ toChips: [], ccChips: [], bccChips: [], subject: "", message: "", file: null });

export default function App() {
  const [active, setActive] = useState("compose");
  const [theme, setTheme] = useState("paper");

  const [compose, setCompose] = useState(emptyCompose());
  const [sending, setSending] = useState(false);

  const [drafts, setDrafts] = useState([]);
  const [templates, setTemplates] = useState(SEED_TEMPLATES.map((t) => ({ ...t, seeded: true })));
  const [contacts, setContacts] = useState(SEED_CONTACTS);
  const [sentHistory, setSentHistory] = useState([]);

  const [senderName, setSenderName] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureEnabled, setSignatureEnabled] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const counts = useMemo(
    () => ({ drafts: drafts.length, templates: 0, contacts: 0, sent: 0, compose: 0, settings: 0 }),
    [drafts.length]
  );

  const toggleTheme = () => setTheme((t) => (t === "paper" ? "ink" : "paper"));

  const doSend = useCallback(async () => {
    const toEmails = [
      ...compose.toChips.filter((c) => c.valid).map((c) => c.value),
      ...compose.ccChips.filter((c) => c.valid).map((c) => c.value),
      ...compose.bccChips.filter((c) => c.valid).map((c) => c.value),
    ];
    const finalMessage =
      signatureEnabled && signature.trim() ? `${compose.message}\n\n${signature}` : compose.message;

    const formData = new FormData();
    formData.append("data", JSON.stringify({ toEmails, subject: compose.subject, message: finalMessage }));
    if (compose.file) formData.append("file", compose.file);

    try {
      setSending(true);
      await axios.post(API_URL, formData);
      setSentHistory((h) => [
        { id: uid("sent"), to: toEmails, subject: compose.subject, sentAt: new Date() },
        ...h,
      ]);
      push("Dispatch sent.");
      setCompose(emptyCompose());
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data || err.message || "The dispatch failed. Try again.";
      push(typeof msg === "string" ? msg : "The dispatch failed. Try again.", "error");
    } finally {
      setSending(false);
      setConfirmOpen(false);
    }
  }, [compose, signature, signatureEnabled, push]);

  const handleSendClick = () => {
    const totalRecipients =
      compose.toChips.filter((c) => c.valid).length +
      compose.ccChips.filter((c) => c.valid).length +
      compose.bccChips.filter((c) => c.valid).length;
    if (totalRecipients > 5) {
      setConfirmOpen(true);
      return;
    }
    doSend();
  };

  const saveDraft = () => {
    setDrafts((d) => [{ id: uid("draft"), ...compose, savedAt: new Date() }, ...d]);
    push("Draft saved.");
  };

  const resumeDraft = (d) => {
    setCompose({ toChips: d.toChips, ccChips: d.ccChips, bccChips: d.bccChips, subject: d.subject, message: d.message, file: d.file });
    setDrafts((ds) => ds.filter((x) => x.id !== d.id));
    setActive("compose");
    push("Draft loaded into compose.");
  };

  const saveTemplate = ({ subject, body }) => {
    setTemplates((t) => [{ id: uid("tpl"), name: subject, subject, body, seeded: false }, ...t]);
    push("Saved as template.");
  };

  const useTemplate = (t) => {
    setCompose((c) => ({ ...c, subject: t.subject, message: t.body }));
    setActive("compose");
    push(`Loaded “${t.name}”.`);
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <GlobalStyle />
      <Sidebar active={active} onChange={setActive} theme={theme} onToggleTheme={toggleTheme} counts={counts} />

      <main className="main">
        {active === "compose" && (
          <ComposeView
            compose={compose}
            setCompose={setCompose}
            contacts={contacts}
            templates={templates}
            onSend={handleSendClick}
            onSaveDraft={saveDraft}
            onSaveTemplate={saveTemplate}
            sending={sending}
            signature={signature}
            signatureEnabled={signatureEnabled}
          />
        )}
        {active === "drafts" && (
          <DraftsView drafts={drafts} onResume={resumeDraft} onDelete={(id) => setDrafts((d) => d.filter((x) => x.id !== id))} />
        )}
        {active === "templates" && (
          <TemplatesView
            templates={templates}
            onUse={useTemplate}
            onDelete={(id) => setTemplates((t) => t.filter((x) => x.id !== id))}
          />
        )}
        {active === "contacts" && <ContactsView contacts={contacts} setContacts={setContacts} push={push} />}
        {active === "sent" && <SentView history={sentHistory} />}
        {active === "settings" && (
          <SettingsView
            senderName={senderName}
            setSenderName={setSenderName}
            signature={signature}
            setSignature={setSignature}
            signatureEnabled={signatureEnabled}
            setSignatureEnabled={setSignatureEnabled}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <ConfirmModal
        open={confirmOpen}
        title="Send to a larger list?"
        body="You're about to dispatch to more than five recipients. Send anyway?"
        confirmLabel="Send"
        onConfirm={doSend}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

/* ---------------------------------- styling ------------------------------------ */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

      .app-shell {
        --ink: #12161c;
        --ink-panel: #171c24;
        --ink-border: rgba(255,255,255,0.08);
        --paper: #f7f1e3;
        --paper-2: #fbf7ec;
        --graphite: #262420;
        --graphite-soft: #6b6552;
        --brass: #b8923f;
        --stamp-red: #a63325;
        --sage: #4b6b4f;
        --paper-border: rgba(38,36,32,0.18);

        display: flex;
        min-height: 100vh;
        width: 100%;
        background: var(--ink);
        font-family: 'Inter', sans-serif;
        color: var(--paper);
      }
      .app-shell[data-theme="ink"] {
        --paper: #1c2128;
        --paper-2: #20262e;
        --graphite: #e9e2cf;
        --graphite-soft: #a39d8a;
        --paper-border: rgba(233,226,207,0.14);
        --stamp-red: #c9503c;
        --brass: #d4ac5c;
      }
      .app-shell *, .app-shell *::before, .app-shell *::after { box-sizing: border-box; }
      .app-shell .icon { display: block; flex-shrink: 0; }

      /* ---------- sidebar ---------- */
      .sidebar {
        width: 216px; flex-shrink: 0; background: var(--ink-panel); border-right: 1px solid var(--ink-border);
        display: flex; flex-direction: column; padding: 22px 14px; gap: 22px; position: sticky; top: 0; height: 100vh;
      }
      .brand { display: flex; align-items: center; gap: 10px; padding: 0 6px; }
      .brand-mark {
        width: 30px; height: 30px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #c24a37, #8f2e20 70%);
        display: flex; align-items: center; justify-content: center; color: #f7e9c9; flex-shrink: 0;
      }
      .brand-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; color: #f2ede0; line-height: 1.2; }
      .brand-sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em; color: #8a7f63; text-transform: uppercase; }

      .nav-list { display: flex; flex-direction: column; gap: 2px; }
      .nav-item {
        display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; border: none;
        background: transparent; color: #a9a190; font-size: 13.5px; cursor: pointer; text-align: left;
        transition: background 0.12s ease, color 0.12s ease; position: relative;
      }
      .nav-item:hover { background: rgba(255,255,255,0.05); color: #f2ede0; }
      .nav-item.active { background: rgba(184,146,63,0.14); color: #f2ede0; }
      .nav-item.active::before {
        content: ""; position: absolute; left: -14px; top: 50%; transform: translateY(-50%);
        width: 3px; height: 16px; background: var(--stamp-red); border-radius: 0 2px 2px 0;
      }
      .nav-count {
        margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8a7f63;
        background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 10px;
      }

      .theme-toggle {
        margin-top: auto; display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 8px;
        border: 1px solid var(--ink-border); background: transparent; color: #a9a190; font-size: 12px; cursor: pointer;
        transition: border-color 0.12s ease, color 0.12s ease;
      }
      .theme-toggle:hover { border-color: var(--brass); color: #f2ede0; }

      /* ---------- main / views ---------- */
      .main { flex: 1; padding: 36px 40px; overflow-y: auto; height: 100vh; }
      .view { max-width: 980px; margin: 0 auto; }
      .view-header { margin-bottom: 22px; }
      .view-header h2 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 24px; margin: 0 0 4px; color: #f2ede0; }
      .view-header p { margin: 0; font-size: 13px; color: #8a8574; font-family: 'JetBrains Mono', monospace; }

      /* ---------- compose layout ---------- */
      .view-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr); gap: 24px; align-items: start; }

      .slip {
        position: relative; background: var(--paper); border-radius: 3px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 30px 60px -20px rgba(0,0,0,0.55);
        padding: 34px 38px 30px;
      }
      .slip::before {
        content: ""; position: absolute; top: 0; left: 28px; right: 28px; height: 0;
        border-top: 2px dashed var(--paper-border);
      }
      .letterhead { display: flex; align-items: flex-start; justify-content: space-between; padding-top: 16px; margin-bottom: 24px; }
      .letterhead h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 26px; color: var(--graphite); margin: 0; }
      .letterhead p { margin: 4px 0 0; font-size: 12px; color: var(--graphite-soft); font-family: 'JetBrains Mono', monospace; }
      .postmark {
        width: 62px; height: 62px; border-radius: 50%; border: 2px solid rgba(38,36,32,0.35); flex-shrink: 0;
        display: flex; align-items: center; justify-content: center; transform: rotate(-9deg); position: relative;
      }
      .postmark::before { content: ""; position: absolute; inset: 5px; border-radius: 50%; border: 1px solid rgba(38,36,32,0.25); }
      .postmark span { font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 500; color: rgba(38,36,32,0.55); text-align: center; line-height: 1.4; }

      .field-block { border-bottom: 1px solid var(--paper-border); padding: 11px 0; }
      .field-block .row { display: flex; align-items: flex-start; gap: 12px; }
      .field-block label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; color: var(--brass); width: 62px; flex-shrink: 0; padding-top: 8px; }
      .to-row { flex: 1; display: flex; flex-direction: column; gap: 6px; }
      .to-actions { display: flex; gap: 12px; }
      .link-btn { border: none; background: transparent; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--graphite-soft); display: inline-flex; align-items: center; gap: 5px; padding: 0; }
      .link-btn:hover { color: var(--stamp-red); }
      .link-btn.danger { color: var(--stamp-red); }

      .chip-field { flex: 1; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-height: 30px; }
      .chip-field.dense { min-height: 26px; }
      .chip {
        display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; padding: 3px 5px 3px 9px;
        border-radius: 20px; background: rgba(38,36,32,0.06); color: var(--graphite); border: 1px solid rgba(38,36,32,0.12);
      }
      .chip.invalid { background: rgba(166,51,37,0.08); border-color: rgba(166,51,37,0.35); color: #8f3223; }
      .chip button { border: none; background: transparent; cursor: pointer; color: inherit; opacity: 0.55; display: flex; padding: 2px; border-radius: 50%; }
      .chip button:hover { opacity: 1; background: rgba(38,36,32,0.1); }
      .chip-field input { flex: 1; min-width: 120px; border: none; background: transparent; outline: none; font-family: 'Inter', sans-serif; font-size: 14.5px; color: var(--graphite); padding: 3px 0; }
      .chip-field input::placeholder { color: rgba(38,36,32,0.32); }

      .contact-popover {
        margin-top: 8px; margin-left: 74px; background: var(--paper-2); border: 1px solid var(--paper-border);
        border-radius: 8px; padding: 6px; max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px;
      }
      .contact-pop-row {
        display: flex; align-items: center; gap: 8px; border: none; background: transparent; cursor: pointer;
        padding: 6px 8px; border-radius: 6px; font-size: 12.5px; text-align: left; width: 100%;
      }
      .contact-pop-row:hover { background: rgba(184,146,63,0.12); }
      .cp-name { color: var(--graphite); font-weight: 500; }
      .cp-email { color: var(--graphite-soft); font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-left: auto; }
      .muted-line { padding: 6px 8px; font-size: 12px; color: var(--graphite-soft); }

      .hint-line { padding-left: 74px; margin-top: 6px; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--stamp-red); }
      .hint-line.quiet { color: var(--graphite-soft); padding-left: 0; margin-bottom: 6px; }

      .field { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--paper-border); padding: 11px 0; }
      .field label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; color: var(--brass); width: 62px; flex-shrink: 0; }
      .field input.plain { flex: 1; border: none; background: transparent; outline: none; font-family: 'Inter', sans-serif; font-size: 14.5px; color: var(--graphite); }
      .field input.plain::placeholder { color: rgba(38,36,32,0.32); }

      .letter-body { margin-top: 18px; }
      .letter-body-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 9px; flex-wrap: wrap; gap: 6px; }
      .letter-body label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; color: var(--brass); }
      .body-meta { display: flex; align-items: center; gap: 10px; }
      .template-select {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--graphite-soft); background: transparent;
        border: 1px solid var(--paper-border); border-radius: 12px; padding: 3px 8px; cursor: pointer;
      }
      .count { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(38,36,32,0.4); }
      .app-shell[data-theme="ink"] .count { color: rgba(233,226,207,0.4); }

      .letter-body textarea {
        width: 100%; min-height: 170px; resize: vertical; border: none; outline: none;
        background-image: repeating-linear-gradient(to bottom, transparent, transparent 27px, var(--paper-border) 27px, var(--paper-border) 28px);
        line-height: 28px; font-family: 'Inter', sans-serif; font-size: 14.5px; color: var(--graphite); padding-top: 2px;
      }
      .letter-body textarea::placeholder { color: rgba(38,36,32,0.32); }
      .signature-preview { margin-top: 6px; font-size: 11px; color: var(--graphite-soft); display: flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; }

      .footer-row { margin-top: 20px; padding-top: 16px; border-top: 1px dashed var(--paper-border); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
      .footer-spacer { flex: 1; }

      .attach {
        display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
        color: var(--graphite-soft); cursor: pointer; padding: 7px 11px; border: 1px solid var(--paper-border); border-radius: 20px;
        background: rgba(255,255,255,0.08); transition: border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
      }
      .attach:hover, .attach.drag { border-color: var(--brass); color: var(--graphite); background: rgba(184,146,63,0.1); }
      .attach input { display: none; }

      .btn-ghost {
        border: 1px solid var(--paper-border); background: transparent; color: var(--graphite-soft); cursor: pointer;
        padding: 8px 13px; border-radius: 8px; font-size: 12.5px; font-family: 'Inter', sans-serif;
        display: inline-flex; align-items: center; gap: 6px; transition: border-color 0.12s ease, color 0.12s ease;
      }
      .btn-ghost:hover:not(:disabled) { border-color: var(--brass); color: var(--graphite); }
      .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
      .btn-ghost.sm { padding: 6px 10px; font-size: 12px; }

      .btn-seal-flat {
        border: none; background: var(--stamp-red); color: #f7e9c9; cursor: pointer; padding: 9px 16px;
        border-radius: 8px; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;
      }
      .btn-seal-flat.sm { padding: 6px 12px; font-size: 12px; }
      .btn-seal-flat:hover { filter: brightness(1.08); }

      .seal-btn {
        position: relative; width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer;
        background: radial-gradient(circle at 35% 30%, #c24a37, #8f2e20 70%);
        box-shadow: 0 3px 0 #6b2116, 0 6px 14px rgba(0,0,0,0.35);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.15s ease;
      }
      .seal-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      .seal-btn:not(:disabled):active { transform: translateY(3px); box-shadow: 0 0 0 #6b2116, 0 2px 6px rgba(0,0,0,0.3); }
      .seal-btn svg { stroke: #f7e9c9; }
      .seal-btn .ring { position: absolute; inset: 5px; border-radius: 50%; border: 1px solid rgba(247,233,201,0.4); }
      .seal-btn.sending svg { animation: spin 0.9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      .kbd-hint { margin-top: 10px; font-size: 10.5px; color: var(--graphite-soft); font-family: 'JetBrains Mono', monospace; display: flex; gap: 4px; align-items: center; }
      kbd { border: 1px solid var(--paper-border); border-radius: 4px; padding: 1px 5px; font-size: 10px; }

      /* ---------- preview pane ---------- */
      .preview-pane { position: sticky; top: 36px; }
      .preview-head { display: flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8a8574; margin-bottom: 10px; letter-spacing: 0.05em; text-transform: uppercase; }
      .preview-card { background: var(--ink-panel); border: 1px solid var(--ink-border); border-radius: 12px; padding: 20px; }
      .preview-line { display: flex; gap: 8px; font-size: 12.5px; margin-bottom: 8px; color: #dcd5c3; }
      .preview-label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #8a8574; width: 54px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 1px; }
      .preview-divider { height: 1px; background: var(--ink-border); margin: 12px 0; }
      .preview-body { font-size: 13.5px; line-height: 1.7; color: #cfc8b4; white-space: pre-wrap; min-height: 100px; }
      .preview-attachment { margin-top: 14px; display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #8a8574; font-family: 'JetBrains Mono', monospace; }

      /* ---------- ledgers (drafts / sent / contacts) ---------- */
      .ledger { display: flex; flex-direction: column; border-top: 1px dashed rgba(255,255,255,0.1); }
      .ledger-row { display: flex; align-items: center; gap: 12px; padding: 13px 4px; border-bottom: 1px dashed rgba(255,255,255,0.1); }
      .ledger-main { flex: 1; min-width: 0; }
      .ledger-title { font-size: 14px; color: #f2ede0; margin-bottom: 2px; }
      .ledger-sub { font-size: 11.5px; color: #8a8574; font-family: 'JetBrains Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ledger-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .ledger-time { text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #cfc8b4; flex-shrink: 0; }
      .ledger-time-sub { font-size: 10px; color: #8a8574; }
      .stamp-dot { width: 22px; height: 22px; border-radius: 50%; background: rgba(75,107,79,0.18); color: #7fa583; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .avatar-dot { width: 26px; height: 26px; border-radius: 50%; background: rgba(184,146,63,0.18); color: var(--brass); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }

      .icon-btn { border: 1px solid var(--ink-border); background: transparent; color: #a9a190; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; }
      .icon-btn:hover { border-color: var(--brass); color: #f2ede0; }
      .icon-btn.danger:hover { border-color: var(--stamp-red); color: #e2887c; }

      /* ---------- templates ---------- */
      .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
      .tpl-card { background: var(--ink-panel); border: 1px solid var(--ink-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
      .tpl-card-head { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--brass); font-family: 'JetBrains Mono', monospace; }
      .tpl-card-subject { font-size: 14.5px; color: #f2ede0; font-weight: 500; }
      .tpl-card-body { font-size: 12.5px; color: #a9a190; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-line; }
      .tpl-card-actions { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; }

      /* ---------- contacts ---------- */
      .contact-form { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
      .contact-form input {
        flex: 1; min-width: 140px; background: var(--ink-panel); border: 1px solid var(--ink-border); border-radius: 8px;
        padding: 9px 12px; color: #f2ede0; font-size: 13px; outline: none;
      }
      .contact-form input:focus { border-color: var(--brass); }
      .search-row { display: flex; align-items: center; gap: 8px; background: var(--ink-panel); border: 1px solid var(--ink-border); border-radius: 8px; padding: 8px 12px; margin-bottom: 18px; color: #8a8574; }
      .search-row input { flex: 1; background: transparent; border: none; outline: none; color: #f2ede0; font-size: 13px; }
      .contact-group { margin-bottom: 18px; }
      .contact-group-title { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #8a8574; margin-bottom: 4px; }

      /* ---------- settings ---------- */
      .settings-card { background: var(--ink-panel); border: 1px solid var(--ink-border); border-radius: 12px; padding: 6px 20px; }
      .settings-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--ink-border); }
      .settings-row:last-child { border-bottom: none; }
      .settings-row.column { flex-direction: column; align-items: stretch; }
      .settings-row-head { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 10px; }
      .settings-label { font-size: 14px; color: #f2ede0; margin-bottom: 3px; }
      .settings-help { font-size: 11.5px; color: #8a8574; max-width: 360px; }
      .settings-input {
        background: var(--ink); border: 1px solid var(--ink-border); border-radius: 8px; padding: 8px 11px;
        color: #f2ede0; font-size: 13px; outline: none; width: 220px;
      }
      .settings-input:focus { border-color: var(--brass); }
      .settings-textarea {
        background: var(--ink); border: 1px solid var(--ink-border); border-radius: 8px; padding: 10px 12px;
        color: #f2ede0; font-size: 13px; outline: none; min-height: 80px; resize: vertical; font-family: 'Inter', sans-serif;
      }
      .switch { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
      .switch input { opacity: 0; width: 0; height: 0; }
      .switch-track { position: absolute; inset: 0; background: rgba(255,255,255,0.12); border-radius: 20px; transition: background 0.15s ease; }
      .switch-thumb { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #d6d0bf; border-radius: 50%; transition: transform 0.15s ease; }
      .switch input:checked + .switch-track { background: var(--stamp-red); }
      .switch input:checked + .switch-track .switch-thumb { transform: translateX(16px); background: #f7e9c9; }

      /* ---------- empty state ---------- */
      .empty-state { text-align: center; padding: 60px 20px; border: 1px dashed var(--ink-border); border-radius: 12px; }
      .empty-icon { width: 44px; height: 44px; border-radius: 50%; background: rgba(184,146,63,0.12); color: var(--brass); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
      .empty-state h3 { font-family: 'Fraunces', serif; font-size: 17px; color: #f2ede0; margin: 0 0 6px; }
      .empty-state p { font-size: 13px; color: #8a8574; margin: 0; max-width: 320px; margin: 0 auto; }

      /* ---------- toasts ---------- */
      .toast-stack { position: fixed; bottom: 22px; right: 22px; display: flex; flex-direction: column; gap: 8px; z-index: 60; }
      .toast {
        display: flex; align-items: center; gap: 8px; background: var(--ink-panel); border: 1px solid var(--ink-border);
        border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #f2ede0; box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        animation: toastIn 0.2s ease-out both; min-width: 220px;
      }
      @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .toast-success svg { color: #7fa583; }
      .toast-error svg { color: #e2887c; }
      .toast button { margin-left: auto; border: none; background: transparent; color: #8a8574; cursor: pointer; display: flex; }

      /* ---------- modal ---------- */
      .modal-veil { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 70; padding: 20px; }
      .modal-card { background: var(--paper); border-radius: 12px; padding: 26px 28px; max-width: 380px; width: 100%; }
      .modal-card h3 { font-family: 'Fraunces', serif; font-size: 18px; color: var(--graphite); margin: 0 0 8px; }
      .modal-card p { font-size: 13.5px; color: var(--graphite-soft); margin: 0 0 20px; line-height: 1.5; }
      .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

      /* ---------- responsive ---------- */
      @media (max-width: 980px) {
        .view-grid { grid-template-columns: 1fr; }
        .preview-pane { position: static; }
      }
      @media (max-width: 760px) {
        .app-shell { flex-direction: column; }
        .sidebar { width: 100%; height: auto; position: static; flex-direction: row; align-items: center; padding: 14px 16px; overflow-x: auto; }
        .nav-list { flex-direction: row; }
        .theme-toggle { margin-top: 0; margin-left: auto; white-space: nowrap; }
        .brand-sub { display: none; }
        .main { padding: 24px 18px; height: auto; }
        .field-block .row, .field { flex-direction: column; align-items: stretch; gap: 4px; }
        .field-block label, .field label { width: auto; padding-top: 0; }
        .hint-line { padding-left: 0; }
        .contact-popover { margin-left: 0; }
      }
    `}</style>
  );
}