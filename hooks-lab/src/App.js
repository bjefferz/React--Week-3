import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────
// ROUTER (minimal hash-based)
// ─────────────────────────────────────────────
function useHashRouter() {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = useCallback((to) => {
    window.location.hash = to;
  }, []);
  return { path, navigate };
}

// ─────────────────────────────────────────────
// FONTS & GLOBAL STYLES
// ─────────────────────────────────────────────
(() => {
  if (typeof document !== "undefined") {
    const l = document.createElement("link");
    l.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }
})();

const css = `
  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1a1a24;
    --border: #2a2a3a;
    --text: #e8e6f0;
    --text2: #9490a8;
    --accent: #f97316;
    --accent2: #fb923c;
    --accent-glow: rgba(249,115,22,0.15);
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --purple: #a855f7;
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'Outfit', system-ui, sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --radius: 12px;
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to { opacity:1; }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.92); }
    to { opacity:1; transform:scale(1); }
  }
  @keyframes pulse {
    0%,100% { transform:scale(1); }
    50% { transform:scale(1.08); }
  }
  @keyframes slideRight {
    from { opacity:0; transform:translateX(-30px); }
    to { opacity:1; transform:translateX(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes counterPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes ringPulse {
    0% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
    100% { box-shadow: 0 0 0 20px rgba(249,115,22,0); }
  }
  @keyframes strikethrough {
    from { width: 0; }
    to { width: 100%; }
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* NAV */
  .top-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(16px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-brand {
    font-family: var(--serif);
    font-size: 22px;
    color: var(--accent);
    margin-right: 32px;
    cursor: pointer;
    letter-spacing: -0.5px;
  }
  .nav-link {
    font-size: 14px;
    font-weight: 500;
    color: var(--text2);
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s;
    text-decoration: none;
    letter-spacing: 0.3px;
  }
  .nav-link:hover { color: var(--text); background: var(--surface2); }
  .nav-link.active {
    color: var(--accent);
    background: var(--accent-glow);
  }

  .page-content {
    flex: 1;
    padding: 48px 32px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .page-title {
    font-family: var(--serif);
    font-size: 42px;
    margin-bottom: 8px;
    letter-spacing: -1px;
    animation: fadeUp 0.5s ease;
  }
  .page-subtitle {
    color: var(--text2);
    font-size: 15px;
    font-weight: 300;
    margin-bottom: 40px;
    animation: fadeUp 0.5s ease 0.1s both;
  }
  .badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 16px;
    animation: fadeIn 0.3s ease;
  }
  .badge-easy { background: rgba(34,197,94,0.15); color: var(--green); }
  .badge-medium { background: rgba(249,115,22,0.15); color: var(--accent); }
  .badge-hard { background: rgba(239,68,68,0.15); color: var(--red); }

  /* COUNTER */
  .counter-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    animation: scaleIn 0.5s ease 0.2s both;
  }
  .counter-ring {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    border: 3px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 40px;
    background: radial-gradient(circle at center, var(--surface2), transparent);
  }
  .counter-ring.animating {
    animation: ringPulse 0.4s ease;
  }
  .counter-value {
    font-family: var(--mono);
    font-size: 64px;
    font-weight: 500;
    color: var(--text);
    transition: color 0.2s;
    user-select: none;
  }
  .counter-value.positive { color: var(--green); }
  .counter-value.negative { color: var(--red); }
  .counter-value.pop { animation: counterPop 0.25s ease; }
  .counter-buttons {
    display: flex;
    gap: 16px;
  }
  .counter-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-family: var(--mono);
  }
  .counter-btn:hover {
    border-color: var(--accent);
    background: var(--accent-glow);
    color: var(--accent);
    transform: scale(1.1);
  }
  .counter-btn:active { transform: scale(0.95); }
  .counter-btn.reset-btn {
    width: auto;
    border-radius: 28px;
    padding: 0 24px;
    font-size: 13px;
    font-family: var(--sans);
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .counter-history {
    margin-top: 32px;
    display: flex;
    gap: 4px;
    align-items: flex-end;
    height: 60px;
  }
  .counter-bar {
    width: 6px;
    border-radius: 3px;
    transition: height 0.3s ease;
    min-height: 2px;
  }

  /* MOVIE SEARCH */
  .search-box {
    position: relative;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease 0.2s both;
  }
  .search-input {
    width: 100%;
    padding: 16px 20px 16px 48px;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 16px;
    font-family: var(--sans);
    outline: none;
    transition: all 0.2s;
  }
  .search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-glow);
  }
  .search-input::placeholder { color: var(--text2); }
  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text2);
    font-size: 18px;
  }
  .movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
  }
  .movie-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.25s;
    animation: fadeUp 0.4s ease both;
  }
  .movie-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }
  .movie-poster {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    background: var(--surface2);
    display: block;
  }
  .movie-poster-placeholder {
    width: 100%;
    aspect-ratio: 2/3;
    background: linear-gradient(135deg, var(--surface2), var(--surface));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: var(--text2);
  }
  .movie-info {
    padding: 14px;
  }
  .movie-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .movie-year {
    color: var(--text2);
    font-size: 12px;
    font-family: var(--mono);
  }
  .movie-rating {
    color: var(--accent);
    font-size: 12px;
    font-weight: 600;
  }

  /* MOVIE DETAIL */
  .movie-detail {
    animation: fadeUp 0.5s ease;
  }
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text2);
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 32px;
    padding: 8px 16px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border);
    font-family: var(--sans);
    transition: all 0.2s;
  }
  .back-btn:hover { color: var(--text); border-color: var(--text2); }
  .detail-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 40px;
    align-items: start;
  }
  .detail-poster {
    width: 100%;
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 16px 0 24px;
  }
  .meta-tag {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: var(--surface2);
    color: var(--text2);
    border: 1px solid var(--border);
  }
  .detail-plot {
    color: var(--text2);
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 24px;
  }
  .detail-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .info-block label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text2);
    margin-bottom: 4px;
  }
  .info-block span {
    font-size: 14px;
    font-weight: 500;
  }

  .loading-shimmer {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius);
  }

  /* TODO */
  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .add-task-form {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease 0.2s both;
  }
  .task-input {
    flex: 1;
    padding: 14px 18px;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 15px;
    font-family: var(--sans);
    outline: none;
    transition: all 0.2s;
  }
  .task-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-glow);
  }
  .task-input::placeholder { color: var(--text2); }
  .add-btn {
    padding: 14px 28px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .add-btn:hover { background: var(--accent2); transform: translateY(-1px); }
  .add-btn:active { transform: scale(0.97); }

  .filter-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    background: var(--surface);
    padding: 4px;
    border-radius: 10px;
    width: fit-content;
    animation: fadeUp 0.5s ease 0.3s both;
  }
  .filter-tab {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text2);
    background: transparent;
    border: none;
    font-family: var(--sans);
    transition: all 0.2s;
  }
  .filter-tab.active {
    background: var(--accent);
    color: white;
  }
  .filter-tab:hover:not(.active) {
    color: var(--text);
    background: var(--surface2);
  }

  .task-list { display: flex; flex-direction: column; gap: 8px; }
  .task-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.2s;
    animation: slideRight 0.3s ease both;
    cursor: pointer;
  }
  .task-item:hover {
    border-color: var(--accent);
    background: var(--surface2);
  }
  .task-checkbox {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid var(--border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
    background: transparent;
    color: transparent;
    font-size: 13px;
  }
  .task-checkbox:hover { border-color: var(--accent); }
  .task-checkbox.checked {
    background: var(--green);
    border-color: var(--green);
    color: white;
  }
  .task-text {
    flex: 1;
    font-size: 15px;
    font-weight: 400;
    position: relative;
  }
  .task-text.completed {
    color: var(--text2);
    text-decoration: line-through;
    text-decoration-color: var(--text2);
  }
  .task-priority {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .priority-high { background: var(--red); }
  .priority-medium { background: var(--accent); }
  .priority-low { background: var(--green); }
  .task-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .task-item:hover .task-actions { opacity: 1; }
  .task-action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.15s;
  }
  .task-action-btn:hover { background: var(--surface); color: var(--text); }
  .task-action-btn.delete:hover { color: var(--red); background: rgba(239,68,68,0.1); }

  .stats-bar {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease 0.15s both;
  }
  .stat-item {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .stat-num {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 500;
  }
  .stat-label {
    font-size: 13px;
    color: var(--text2);
    font-weight: 300;
  }

  /* TASK DETAIL */
  .task-detail {
    animation: fadeUp 0.5s ease;
  }
  .task-detail-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    max-width: 600px;
  }
  .task-detail-title {
    font-family: var(--serif);
    font-size: 28px;
    margin-bottom: 24px;
  }
  .task-detail-field {
    margin-bottom: 20px;
  }
  .task-detail-field label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text2);
    margin-bottom: 8px;
  }
  .detail-field-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 15px;
    font-family: var(--sans);
    outline: none;
    transition: border-color 0.2s;
  }
  .detail-field-input:focus { border-color: var(--accent); }
  .detail-field-select {
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
    font-family: var(--sans);
    outline: none;
    cursor: pointer;
  }
  .detail-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }
  .save-btn {
    padding: 12px 28px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--sans);
    transition: all 0.2s;
  }
  .save-btn:hover { background: var(--accent2); }
  .delete-full-btn {
    padding: 12px 28px;
    background: rgba(239,68,68,0.1);
    color: var(--red);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--sans);
    transition: all 0.2s;
  }
  .delete-full-btn:hover { background: rgba(239,68,68,0.2); }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text2);
    animation: fadeIn 0.4s ease;
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
  .empty-text { font-size: 15px; font-weight: 300; }

  /* HOME */
  .home-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 48px;
  }
  .home-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    cursor: pointer;
    transition: all 0.3s;
    animation: fadeUp 0.5s ease both;
    position: relative;
    overflow: hidden;
  }
  .home-card:nth-child(1) { animation-delay: 0.1s; }
  .home-card:nth-child(2) { animation-delay: 0.2s; }
  .home-card:nth-child(3) { animation-delay: 0.3s; }
  .home-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  }
  .home-card-icon {
    font-size: 36px;
    margin-bottom: 20px;
  }
  .home-card-title {
    font-family: var(--serif);
    font-size: 22px;
    margin-bottom: 8px;
  }
  .home-card-desc {
    color: var(--text2);
    font-size: 13px;
    line-height: 1.6;
    font-weight: 300;
  }
  .home-card-badge {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .hero-text {
    font-family: var(--serif);
    font-size: 56px;
    letter-spacing: -2px;
    line-height: 1.1;
    margin-bottom: 16px;
    animation: fadeUp 0.6s ease;
  }
  .hero-text span { color: var(--accent); }
  .hero-sub {
    color: var(--text2);
    font-size: 17px;
    font-weight: 300;
    max-width: 500px;
    line-height: 1.6;
    animation: fadeUp 0.6s ease 0.1s both;
  }

  @media (max-width: 768px) {
    .home-grid { grid-template-columns: 1fr; }
    .detail-layout { grid-template-columns: 1fr; }
    .hero-text { font-size: 36px; }
    .page-content { padding: 32px 16px; }
    .top-nav { padding: 12px 16px; }
    .movie-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  }
`;

// ─────────────────────────────────────────────
// COUNTER PAGE (EASY)
// ─────────────────────────────────────────────
function CounterPage() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  const [animating, setAnimating] = useState(false);
  const [popping, setPopping] = useState(false);

  const updateCount = (newVal) => {
    setCount(newVal);
    setHistory((prev) => [...prev.slice(-39), newVal]);
    setAnimating(true);
    setPopping(true);
    setTimeout(() => setAnimating(false), 400);
    setTimeout(() => setPopping(false), 250);
  };

  const maxAbs = Math.max(...history.map(Math.abs), 1);

  return (
    <div>
      <div className="badge badge-easy">Easy</div>
      <h1 className="page-title">Counter</h1>
      <p className="page-subtitle">
        A simple counter built with React's useState hook
      </p>

      <div className="counter-wrap">
        <div className={`counter-ring ${animating ? "animating" : ""}`}>
          <span
            className={`counter-value ${popping ? "pop" : ""} ${
              count > 0 ? "positive" : count < 0 ? "negative" : ""
            }`}
          >
            {count}
          </span>
        </div>

        <div className="counter-buttons">
          <button
            className="counter-btn"
            onClick={() => updateCount(count - 1)}
          >
            −
          </button>
          <button
            className="counter-btn reset-btn"
            onClick={() => updateCount(0)}
          >
            Reset
          </button>
          <button
            className="counter-btn"
            onClick={() => updateCount(count + 1)}
          >
            +
          </button>
        </div>

        {history.length > 1 && (
          <div className="counter-history">
            {history.map((val, i) => {
              const h = Math.max((Math.abs(val) / maxAbs) * 50, 2);
              return (
                <div
                  key={i}
                  className="counter-bar"
                  style={{
                    height: `${h}px`,
                    background:
                      val > 0
                        ? "var(--green)"
                        : val < 0
                        ? "var(--red)"
                        : "var(--border)",
                    opacity: 0.4 + (i / history.length) * 0.6,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MOVIE SEARCH PAGE (MEDIUM)
// ─────────────────────────────────────────────
const OMDB_KEY = "56b12a1d"; // free demo API key

function MovieSearchPage({ navigate }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const searchMovies = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(q)}&type=movie`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setMovies(data.Search || []);
      } else {
        setMovies([]);
        setError(data.Error || "No results found");
      }
    } catch (e) {
      setError("Failed to fetch. Check your connection.");
      setMovies([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length >= 3) {
      debounceRef.current = setTimeout(() => searchMovies(query), 500);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query, searchMovies]);

  return (
    <div>
      <div className="badge badge-medium">Medium</div>
      <h1 className="page-title">Movie Search</h1>
      <p className="page-subtitle">
        Search films using the OMDb API with debounced queries and detail views
      </p>

      <div className="search-box">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search for movies… (e.g. Inception, Matrix, Interstellar)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && searchMovies(query)
          }
        />
      </div>

      {loading && (
        <div className="movie-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              <div
                className="loading-shimmer"
                style={{ aspectRatio: "2/3", marginBottom: 12 }}
              />
              <div
                className="loading-shimmer"
                style={{ height: 16, width: "70%", marginBottom: 6 }}
              />
              <div
                className="loading-shimmer"
                style={{ height: 12, width: "40%" }}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && error && searched && (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <div className="empty-text">{error}</div>
        </div>
      )}

      {!loading && !error && movies.length === 0 && !searched && (
        <div className="empty-state">
          <div className="empty-icon">🍿</div>
          <div className="empty-text">
            Type at least 3 characters to search for movies
          </div>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((m, i) => (
            <div
              key={m.imdbID}
              className="movie-card"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => navigate(`/movies/${m.imdbID}`)}
            >
              {m.Poster && m.Poster !== "N/A" ? (
                <img
                  className="movie-poster"
                  src={m.Poster}
                  alt={m.Title}
                  loading="lazy"
                />
              ) : (
                <div className="movie-poster-placeholder">🎬</div>
              )}
              <div className="movie-info">
                <div className="movie-title">{m.Title}</div>
                <div className="movie-year">{m.Year}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MovieDetailPage({ id, navigate }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${id}&plot=full`)
      .then((r) => r.json())
      .then((data) => {
        setMovie(data.Response === "True" ? data : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail">
        <div
          className="loading-shimmer"
          style={{ height: 40, width: 120, marginBottom: 32 }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40 }}>
          <div className="loading-shimmer" style={{ aspectRatio: "2/3" }} />
          <div>
            <div className="loading-shimmer" style={{ height: 36, width: "60%", marginBottom: 16 }} />
            <div className="loading-shimmer" style={{ height: 16, width: "100%", marginBottom: 8 }} />
            <div className="loading-shimmer" style={{ height: 16, width: "80%", marginBottom: 8 }} />
            <div className="loading-shimmer" style={{ height: 16, width: "90%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <div className="empty-text">Movie not found</div>
        <button className="back-btn" onClick={() => navigate("/movies")} style={{ marginTop: 20 }}>
          ← Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      <button className="back-btn" onClick={() => navigate("/movies")}>
        ← Back to search
      </button>

      <div className="detail-layout">
        {movie.Poster && movie.Poster !== "N/A" ? (
          <img className="detail-poster" src={movie.Poster} alt={movie.Title} />
        ) : (
          <div
            className="movie-poster-placeholder detail-poster"
            style={{ borderRadius: "var(--radius)" }}
          >
            🎬
          </div>
        )}

        <div>
          <h1 className="page-title" style={{ fontSize: 32, marginBottom: 4 }}>
            {movie.Title}
          </h1>
          <div className="detail-meta">
            <span className="meta-tag">{movie.Year}</span>
            <span className="meta-tag">{movie.Rated}</span>
            <span className="meta-tag">{movie.Runtime}</span>
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <span
                className="meta-tag"
                style={{ background: "var(--accent-glow)", color: "var(--accent)", borderColor: "var(--accent)" }}
              >
                ★ {movie.imdbRating}
              </span>
            )}
          </div>

          {movie.Genre && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {movie.Genre.split(", ").map((g) => (
                <span
                  key={g}
                  className="meta-tag"
                  style={{ background: "rgba(168,85,247,0.1)", color: "var(--purple)", borderColor: "rgba(168,85,247,0.2)" }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="detail-plot">{movie.Plot}</p>

          <div className="detail-info-grid">
            {movie.Director && movie.Director !== "N/A" && (
              <div className="info-block">
                <label>Director</label>
                <span>{movie.Director}</span>
              </div>
            )}
            {movie.Actors && movie.Actors !== "N/A" && (
              <div className="info-block">
                <label>Cast</label>
                <span>{movie.Actors}</span>
              </div>
            )}
            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <div className="info-block">
                <label>Box Office</label>
                <span>{movie.BoxOffice}</span>
              </div>
            )}
            {movie.Awards && movie.Awards !== "N/A" && (
              <div className="info-block">
                <label>Awards</label>
                <span>{movie.Awards}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TODO LIST PAGE (HARD)
// ─────────────────────────────────────────────
const defaultTasks = [
  { id: 1, text: "Review React hooks documentation", done: false, priority: "high", created: Date.now() - 100000 },
  { id: 2, text: "Build counter component", done: true, priority: "medium", created: Date.now() - 200000 },
  { id: 3, text: "Integrate movie search API", done: false, priority: "high", created: Date.now() - 50000 },
  { id: 4, text: "Add routing between pages", done: false, priority: "low", created: Date.now() - 300000 },
];

function TodoListPage({ navigate, tasks, setTasks }) {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("medium");

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      done: false,
      priority,
      created: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const activeTasks = totalTasks - doneTasks;

  return (
    <div>
      <div className="badge badge-hard">Hard</div>
      <h1 className="page-title">Task Manager</h1>
      <p className="page-subtitle">
        Full CRUD to-do app with priorities, filtering, and detail views
      </p>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num" style={{ color: "var(--blue)" }}>
            {totalTasks}
          </span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: "var(--accent)" }}>
            {activeTasks}
          </span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: "var(--green)" }}>
            {doneTasks}
          </span>
          <span className="stat-label">Done</span>
        </div>
      </div>

      <div className="add-task-form">
        <input
          className="task-input"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <select
          className="detail-field-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: 120 }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>
      </div>

      <div className="filter-tabs">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <div className="empty-text">
            {filter === "completed"
              ? "No completed tasks yet"
              : filter === "active"
              ? "All tasks are done! 🎉"
              : "No tasks yet. Add one above!"}
          </div>
        </div>
      ) : (
        <div className="task-list">
          {filtered.map((task, i) => (
            <div
              key={task.id}
              className="task-item"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => navigate(`/todos/${task.id}`)}
            >
              <button
                className={`task-checkbox ${task.done ? "checked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id);
                }}
              >
                {task.done ? "✓" : ""}
              </button>
              <div
                className="task-priority"
                style={{}}
              >
                <div
                  className={`task-priority priority-${task.priority}`}
                />
              </div>
              <span className={`task-text ${task.done ? "completed" : ""}`}>
                {task.text}
              </span>
              <div className="task-actions">
                <button
                  className="task-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/todos/${task.id}`);
                  }}
                >
                  ✎
                </button>
                <button
                  className="task-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskDetailPage({ id, navigate, tasks, setTasks }) {
  const task = tasks.find((t) => t.id === Number(id));
  const [text, setText] = useState(task?.text || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [saved, setSaved] = useState(false);

  if (!task) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <div className="empty-text">Task not found</div>
        <button
          className="back-btn"
          onClick={() => navigate("/todos")}
          style={{ marginTop: 20 }}
        >
          ← Back to tasks
        </button>
      </div>
    );
  }

  const saveTask = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, text: text.trim(), priority } : t
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteTask = () => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    navigate("/todos");
  };

  return (
    <div className="task-detail">
      <button className="back-btn" onClick={() => navigate("/todos")}>
        ← Back to tasks
      </button>

      <div className="task-detail-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div className={`task-priority priority-${task.priority}`} style={{ width: 10, height: 10 }} />
          <span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--mono)" }}>
            ID: {task.id}
          </span>
          <span
            style={{
              fontSize: 12,
              padding: "2px 10px",
              borderRadius: 12,
              background: task.done ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
              color: task.done ? "var(--green)" : "var(--accent)",
              fontWeight: 600,
            }}
          >
            {task.done ? "Completed" : "Active"}
          </span>
        </div>
        <h2 className="task-detail-title">Edit Task</h2>

        <div className="task-detail-field">
          <label>Task Description</label>
          <input
            className="detail-field-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveTask()}
          />
        </div>

        <div className="task-detail-field">
          <label>Priority</label>
          <select
            className="detail-field-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟠 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div className="task-detail-field">
          <label>Created</label>
          <span style={{ fontSize: 14, color: "var(--text2)", fontFamily: "var(--mono)" }}>
            {new Date(task.created).toLocaleString()}
          </span>
        </div>

        <div className="detail-actions">
          <button className="save-btn" onClick={saveTask}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
          <button className="delete-full-btn" onClick={deleteTask}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function HomePage({ navigate }) {
  return (
    <div>
      <h1 className="hero-text">
        React Hooks <span>&</span>
        <br />
        Router Showcase
      </h1>
      <p className="hero-sub">
        Three challenges in one app — from a simple counter to a full task
        manager, all built with React hooks, hash-based routing, and polished
        interactions.
      </p>

      <div className="home-grid">
        <div className="home-card" onClick={() => navigate("/counter")}>
          <span className="home-card-badge badge badge-easy">Easy</span>
          <div className="home-card-icon">🔢</div>
          <h3 className="home-card-title">Counter</h3>
          <p className="home-card-desc">
            Increment & decrement with useState, animated ring, and live history
            visualization.
          </p>
        </div>

        <div className="home-card" onClick={() => navigate("/movies")}>
          <span className="home-card-badge badge badge-medium">Medium</span>
          <div className="home-card-icon">🎬</div>
          <h3 className="home-card-title">Movie Search</h3>
          <p className="home-card-desc">
            Debounced API search, poster grid with loading skeletons, and
            full detail views via routing.
          </p>
        </div>

        <div className="home-card" onClick={() => navigate("/todos")}>
          <span className="home-card-badge badge badge-hard">Hard</span>
          <div className="home-card-icon">✅</div>
          <h3 className="home-card-title">Task Manager</h3>
          <p className="home-card-desc">
            Add, edit, delete, and filter tasks. Priority levels, stats bar,
            and routed detail/edit page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
export default function App() {
  const { path, navigate } = useHashRouter();
  const [tasks, setTasks] = useState(defaultTasks);

  const navLinks = [
    { path: "/counter", label: "Counter" },
    { path: "/movies", label: "Movies" },
    { path: "/todos", label: "Tasks" },
  ];

  const renderPage = () => {
    if (path === "/" || path === "") return <HomePage navigate={navigate} />;
    if (path === "/counter") return <CounterPage />;
    if (path === "/movies")
      return <MovieSearchPage navigate={navigate} />;
    if (path.startsWith("/movies/")) {
      const id = path.split("/movies/")[1];
      return <MovieDetailPage id={id} navigate={navigate} />;
    }
    if (path === "/todos")
      return (
        <TodoListPage
          navigate={navigate}
          tasks={tasks}
          setTasks={setTasks}
        />
      );
    if (path.startsWith("/todos/")) {
      const id = path.split("/todos/")[1];
      return (
        <TaskDetailPage
          id={id}
          navigate={navigate}
          tasks={tasks}
          setTasks={setTasks}
        />
      );
    }
    return <HomePage navigate={navigate} />;
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-container">
        <nav className="top-nav">
          <span className="nav-brand" onClick={() => navigate("/")}>
            ◆ Hooks Lab
          </span>
          {navLinks.map((link) => (
            <span
              key={link.path}
              className={`nav-link ${
                path === link.path || path.startsWith(link.path + "/")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </span>
          ))}
        </nav>

        <div className="page-content">{renderPage()}</div>
      </div>
    </>
  );
}
