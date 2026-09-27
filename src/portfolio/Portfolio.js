import React from "react";

const styles = `
  :root {
    box-sizing: border-box;
    --ink: #14171C;
    --paper: #EFEAD8;
    --paper-card: #F7F3E6;
    --paper-card-2: #E7E0C8;
    --rule: #C9BFA0;
    --sub: #55503F;
    --amber: #92621E;
    --amber-strong: #7A5118;
    --panel-bg: #14161C;
    --panel-fg: #E7E2D2;
    --panel-sub: #8B93A6;
    --panel-accent: #C99A3C;
  }
  @media (prefers-color-scheme: dark) {
    .portfolio-root:not([data-theme="light"]) {
      --ink: #ECE6D6;
      --paper: #0C0D10;
      --paper-card: #15171C;
      --paper-card-2: #1D2027;
      --rule: #33363E;
      --sub: #A8A290;
      --amber: #D9A94A;
      --amber-strong: #E8BE66;
      --panel-bg: #0B0C0F;
      --panel-fg: #E7E2D2;
      --panel-sub: #7C8496;
      --panel-accent: #D9A94A;
    }
  }
  .portfolio-root[data-theme="dark"] {
    --ink: #ECE6D6;
    --paper: #0C0D10;
    --paper-card: #15171C;
    --paper-card-2: #1D2027;
    --rule: #33363E;
    --sub: #A8A290;
    --amber: #D9A94A;
    --amber-strong: #E8BE66;
    --panel-bg: #0B0C0F;
    --panel-fg: #E7E2D2;
    --panel-sub: #7C8496;
    --panel-accent: #D9A94A;
  }
  .portfolio-root * { box-sizing: inherit; }
  .portfolio-root {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Inter', sans-serif;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    min-height: 100%;
  }
  .portfolio-root h1, .portfolio-root h2, .portfolio-root h3 {
    font-family: 'Source Serif 4', serif; font-weight: 700; margin: 0;
  }
  .portfolio-root .wrap { max-width: 980px; margin: 0 auto; padding: 0 24px; }
  .portfolio-root a { color: var(--amber-strong); }

  .portfolio-root header.masthead { padding: 28px 0 0; text-align: center; }
  .portfolio-root .mast-topline {
    display: flex; justify-content: space-between;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.04em; color: var(--sub);
    border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
    padding: 6px 0;
  }
  .portfolio-root .mast-title {
    font-size: clamp(2.4rem, 7vw, 4.4rem); letter-spacing: -0.01em; padding: 22px 0 6px;
  }
  .portfolio-root .mast-sub {
    font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; color: var(--sub); padding-bottom: 20px;
  }

  .portfolio-root .ticker {
    background: var(--ink); color: var(--paper);
    overflow: hidden; white-space: nowrap; border-bottom: 1px solid var(--rule);
  }
  .portfolio-root .ticker-track {
    display: inline-block; padding: 10px 0;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem; letter-spacing: 0.02em;
    animation: portfolio-scroll-left 32s linear infinite;
  }
  .portfolio-root .ticker-track span { color: var(--amber-strong); margin: 0 22px; }
  @keyframes portfolio-scroll-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .portfolio-root .ticker-track { animation: none; }
  }

  .portfolio-root section.byline {
    padding: 40px 0 36px; border-bottom: 1px solid var(--rule);
    display: grid; grid-template-columns: 120px 1fr; gap: 28px; align-items: start;
  }
  .portfolio-root .initials {
    width: 96px; height: 96px; border: 1px solid var(--rule);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Source Serif 4', serif; font-size: 1.6rem; color: var(--amber-strong);
  }
  .portfolio-root .byline h2 { font-size: 1.4rem; margin-bottom: 10px; }
  .portfolio-root .byline p { color: var(--sub); max-width: 62ch; margin: 0 0 8px; }
  .portfolio-root .byline .contact { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; margin-top: 10px; }
  .portfolio-root .byline .contact a { text-decoration: none; margin-right: 16px; }

  .portfolio-root .desk-label {
    font-family: 'IBM Plex Mono', monospace; font-size: 0.74rem; color: var(--amber-strong);
    border-bottom: 1px solid var(--amber); display: inline-block; padding-bottom: 3px; margin-bottom: 14px;
  }
  .portfolio-root article.dispatch { padding: 44px 0; border-bottom: 1px solid var(--rule); }
  .portfolio-root article.dispatch h3 { font-size: clamp(1.5rem, 3.4vw, 2rem); line-height: 1.15; max-width: 24ch; }
  .portfolio-root .dek { color: var(--sub); font-size: 1.02rem; max-width: 58ch; margin: 12px 0 26px; }

  .portfolio-root .dispatch-grid {
    display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 32px; align-items: start;
  }
  @media (max-width: 760px) {
    .portfolio-root .dispatch-grid { grid-template-columns: 1fr; }
    .portfolio-root section.byline { grid-template-columns: 72px 1fr; }
    .portfolio-root .initials { width: 64px; height: 64px; font-size: 1.1rem; }
  }

  .portfolio-root .stats-row {
    display: flex; gap: 22px; flex-wrap: wrap; margin-bottom: 22px; padding: 14px 0;
    border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
  }
  .portfolio-root .stat b { font-family: 'Source Serif 4', serif; font-size: 1.3rem; display: block; }
  .portfolio-root .stat span { font-size: 0.72rem; color: var(--sub); font-family: 'IBM Plex Mono', monospace; }

  .portfolio-root .pipeline { margin: 0 0 22px; padding: 0; list-style: none; }
  .portfolio-root .pipeline li {
    font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;
    padding: 7px 0 7px 20px; border-left: 2px solid var(--rule); position: relative;
  }
  .portfolio-root .pipeline li::before {
    content: ''; position: absolute; left: -5px; top: 13px;
    width: 8px; height: 8px; border-radius: 50%; background: var(--amber-strong);
  }
  .portfolio-root .decisions p { color: var(--sub); font-size: 0.95rem; }

  .portfolio-root .code-panel {
    background: var(--panel-bg); color: var(--panel-fg); border-radius: 6px;
    padding: 0; overflow: hidden; position: sticky; top: 16px;
  }
  .portfolio-root .code-panel .code-head {
    display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem; color: var(--panel-sub); padding: 10px 16px; border-bottom: 1px solid #2A2E38;
  }
  .portfolio-root .code-panel pre {
    margin: 0; padding: 16px; overflow-x: auto;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; line-height: 1.55;
  }
  .portfolio-root .code-panel .kw { color: var(--panel-accent); }
  .portfolio-root .code-panel .cm { color: var(--panel-sub); }

  .portfolio-root .stack-line { font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; color: var(--sub); margin-top: 14px; }
  .portfolio-root .stack-line b { color: var(--ink); font-weight: 600; }

  .portfolio-root .also-wire {
    padding: 30px 0 6px;
  }
  .portfolio-root .also-wire .desk-label { margin-bottom: 10px; }
  .portfolio-root .also-wire p { color: var(--sub); margin: 6px 0 10px; max-width: 62ch; }
  .portfolio-root .also-wire .stack-line { margin-top: 0; }

  .portfolio-root footer { padding: 40px 0 60px; text-align: center; }
  .portfolio-root footer .contact-links { font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; }
  .portfolio-root footer .contact-links a { margin: 0 14px; text-decoration: none; }
  .portfolio-root footer .kicker { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: var(--sub); margin-top: 26px; }
`;

const tickerItems = [
  "JAVA", "SPRING BOOT", "KAFKA", "REDIS", "MYSQL", "MONGODB",
  "MULTITHREADING", "SYSTEM DESIGN", "LLD", "DSA", "GIT", "JENKINS", "LINUX",
];

function Ticker() {
  const renderItems = (keyPrefix) =>
    tickerItems.map((item, i) => <span key={`${keyPrefix}-${i}`}>{item}</span>);
  return (
    <div className="ticker">
      <div className="ticker-track">
        {renderItems("a")}
        &nbsp;&nbsp;
        {renderItems("b")}
        &nbsp;&nbsp;
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="portfolio-root">
      <style>{styles}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <header className="masthead">
        <div className="wrap">
          <div className="mast-topline">
            <span>BACKEND SYSTEMS DESK</span>
            <span>VOL. 1 — 2026 EDITION</span>
          </div>
          <h1 className="mast-title">The Anmol Mehla Dispatch</h1>
          <div className="mast-sub">
            Java · Spring Boot · Backend Systems — filed from Times Internet's Economic Times desk
          </div>
        </div>
      </header>

      <Ticker />

      <div className="wrap">
        <section className="byline">
          <div className="initials">AM</div>
          <div>
            <h2>SDE Intern, Backend &amp; Distributed Systems</h2>
            <p>
              Six months into building backend services at Times Internet, on the Economic
              Times desk — personalized feeds, event-driven mailers, and the cron jobs nobody
              notices until they stop running. Java and Spring Boot by day; two production
              side-projects, built solo, by night.
            </p>
            <p>
              Comfortable owning a product end to end: design, build, test, ship, and carry
              the pager for it afterward.
            </p>
            <div className="contact">
              <a href="mailto:anmolmehla4@gmail.com">anmolmehla4@gmail.com</a>
              <a href="tel:+918398963836">8398963836</a>
              <a href="https://www.linkedin.com/in/anmehla09" target="_blank" rel="noreferrer">linkedin.com/in/anmehla09</a>
              <a href="https://github.com/Ak-Sat09" target="_blank" rel="noreferrer">github.com/Ak-Sat09</a>
            </div>
          </div>
        </section>

        <article className="dispatch">
          <span className="desk-label">ECONOMIC TIMES DESK</span>
          <h3>Keeping 10 Million Watchlist Records Honest</h3>
          <p className="dek">
            Backend work inside Times Internet's Economic Times products: personalized user
            feeds, scheduled cleanup at scale, and email triggers that finally stopped
            silently failing.
          </p>

          <div className="dispatch-grid">
            <div>
              <div className="stats-row">
                <div className="stat"><b>10M+</b><span>WATCHLIST RECORDS DEDUPED</span></div>
                <div className="stat"><b>6 MOS</b><span>AS SDE INTERN</span></div>
                <div className="stat"><b>MULTI-PRODUCT</b><span>BACKEND OWNERSHIP</span></div>
              </div>

              <ul className="pipeline">
                <li>User interactions update an interest/preference profile, consumed by the feed service to personalize what each reader sees</li>
                <li>Scheduled Cron jobs sweep Watchlist collections in MongoDB, deduping records and applying bulk field updates across 10M+ documents</li>
                <li>User interactions trigger step-based, event-driven email sequences instead of one-shot sends</li>
                <li>Failed mailer deliveries retry with backoff before falling to a dead-letter path, instead of silently dropping</li>
              </ul>

              <div className="decisions">
                <p><b style={{ color: "var(--ink)" }}>Why bulk, scheduled cleanup:</b> record-by-record fixes don't survive at 10M+ documents; batching the dedupe and field updates into Cron jobs keeps the write load predictable instead of spiking the primary path.</p>
                <p><b style={{ color: "var(--ink)" }}>Why retries before giving up:</b> most mailer failures are transient (a provider hiccup, a timeout) — retrying with backoff recovers most of them without paging anyone, and only the genuine failures reach a dead-letter queue.</p>
              </div>
              <div className="stack-line">Filed under: <b>Java · Spring Boot · MongoDB · Kafka · Redis</b></div>
            </div>

            <div className="code-panel">
              <div className="code-head"><span>MailerRetryService.java</span><span>excerpt</span></div>
              <pre>{`public class MailerRetryService {
    private static final int MAX_ATTEMPTS = 5;
    private static final long BASE_DELAY_MILLIS = 2000L;

    private final MailerClient mailerClient;
    private final ScheduledExecutorService scheduler;
    private final DeadLetterStore deadLetterStore;

    public MailerRetryService(MailerClient mailerClient,
                               ScheduledExecutorService scheduler,
                               DeadLetterStore deadLetterStore) {
        this.mailerClient = mailerClient;
        this.scheduler = scheduler;
        this.deadLetterStore = deadLetterStore;
    }

    public void send(EmailJob job) {
        attempt(job, 1);
    }

    // transient failures back off and retry;
    // only genuine failures reach the dead letter store
    private void attempt(EmailJob job, int attemptNo) {
        try {
            mailerClient.deliver(job);
        } catch (TransientMailException e) {
            if (attemptNo >= MAX_ATTEMPTS) {
                deadLetterStore.save(job, e);
                return;
            }
            long delay = BASE_DELAY_MILLIS * (1L << (attemptNo - 1));
            scheduler.schedule(() -> attempt(job, attemptNo + 1),
                delay, TimeUnit.MILLISECONDS);
        }
    }
}`}</pre>
            </div>
          </div>
        </article>

        <article className="dispatch">
          <span className="desk-label">MARKETPLACE DESK</span>
          <h3>Coupon &amp; Voucher Marketplace: One Engineer, Three Sides of a Market</h3>
          <p className="dek">
            A coupon marketplace for buyers, sellers, and admins — designed, built, and
            operated end to end, including production support.
          </p>

          <div className="dispatch-grid">
            <div>
              <div className="stats-row">
                <div className="stat"><b>SOLO</b><span>END-TO-END OWNERSHIP</span></div>
                <div className="stat"><b>3 ROLES</b><span>BUYER · SELLER · ADMIN</span></div>
                <div className="stat"><b>LIVE</b><span>DEPLOYED ON VERCEL</span></div>
              </div>

              <ul className="pipeline">
                <li>Sellers list coupons behind a masked code; buyer visibility is gated by seller approval before any code is exposed</li>
                <li>Buyer purchases route through Razorpay; verified payment unlocks the real code, which can be saved and tracked to expiry</li>
                <li>Buyer and seller chat in real time over WebSockets, sharing images, video, and audio via Cloudinary</li>
                <li>Feed is personalized from interests, saved coupons, purchases, and interaction history</li>
                <li>Email notifications cover the full lifecycle: request, approval, purchase, and saved-coupon expiry reminders</li>
              </ul>

              <div className="decisions">
                <p><b style={{ color: "var(--ink)" }}>Why mask the code until purchase:</b> a visible code is a redeemed code — masking it until payment is verified, then deleting it post-redemption, means a leaked listing page never leaks an unpaid-for coupon.</p>
                <p><b style={{ color: "var(--ink)" }}>Why WebSockets for buyer–seller chat:</b> coupon deals move fast and often need a photo or a quick voice note to close; a chat that has to be refreshed loses that window.</p>
              </div>
              <div className="stack-line">
                Filed under: <b>Java · Spring Boot · MongoDB · WebSockets · Razorpay · Cloudinary</b>
                <br />
                <a href="https://github.com/Ak-Sat09/Coupon-And-Voucher-Service" target="_blank" rel="noreferrer">Code</a>
                {" · "}
                <a href="https://coupon-voucher-service-frontend.vercel.app/" target="_blank" rel="noreferrer">Live</a>
              </div>
            </div>

            <div className="code-panel">
              <div className="code-head"><span>CouponAccessService.java</span><span>excerpt</span></div>
              <pre>{`public class CouponAccessService {
    private final CouponRepository coupons;

    public CouponAccessService(CouponRepository coupons) {
        this.coupons = coupons;
    }

    // buyers only ever see a masked code until purchase is verified
    public String maskedCode(Coupon coupon) {
        String code = coupon.getRawCode();
        return code.substring(0, 2)
            + "*".repeat(code.length() - 4)
            + code.substring(code.length() - 2);
    }

    public String revealAfterPurchase(String couponId, String buyerId,
                                       Purchase purchase) {
        Coupon coupon = coupons.findById(couponId)
            .orElseThrow(() -> new CouponNotFoundException(couponId));

        if (!purchase.isVerified() || !purchase.getBuyerId().equals(buyerId)) {
            throw new UnauthorizedCouponAccessException(couponId, buyerId);
        }
        return coupon.getRawCode();
    }

    // redeemed codes are deleted, not just flagged —
    // a redeemed coupon should be unrecoverable, not just hidden
    public void deleteAfterRedemption(String couponId) {
        coupons.deleteById(couponId);
    }
}`}</pre>
            </div>
          </div>
        </article>

        <div className="also-wire">
          <span className="desk-label">ALSO ON THE WIRE</span>
          <p>
            <b style={{ color: "var(--ink)" }}>Chronicle — Blog Platform.</b> A microservices
            blogging platform built with Spring Boot: JWT-authenticated publishing, real-time
            collaborative editing with an admin-approval workflow, pre-signed URL uploads
            straight from client to cloud storage, and likes, comments, and sharing.
          </p>
          <div className="stack-line">
            <a href="https://github.com/Ak-Sat09/chronicle-blog-platform" target="_blank" rel="noreferrer">Code</a>
            {" · "}
            <a href="https://chronicle09.vercel.app/" target="_blank" rel="noreferrer">Live</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="contact-links">
          <a href="mailto:anmolmehla4@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/anmehla09" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Ak-Sat09" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div className="kicker">— 30 —</div>
      </footer>
    </div>
  );
}
