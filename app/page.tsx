"use client";

import React, { useState, useEffect, useRef } from "react";

interface MemberProfile {
  id: string;
  name: string;
  initials: string;
  avatarLetter: string;
  avatarClass: string;
  role: string;
  focus: string;
  bio: string;
  photo?: string;
  filterText: string;
}

const MEMBERS: MemberProfile[] = [
  {
    id: "jemkirk",
    name: "Jemkirk Utana",
    initials: "J.U.",
    avatarLetter: "J",
    avatarClass: "avatar-jemkirk",
    role: "Project Manager / Developer · Section II-ACSAD",
    focus: "Project Manager / Developer",
    bio: "I serve as the Project Manager and Developer for our group in Section II-ACSAD. I coordinate our tasks and deadlines, and build and maintain this ORGCOM web page.",
    photo: "/members/jemkirk.jpg",
    filterText: "jemkirk utana j project manager developer",
  },
  {
    id: "kirk",
    name: "Kirk Stanley Tan",
    initials: "K.S.T.",
    avatarLetter: "K",
    avatarClass: "avatar-kirk",
    role: "Team Member · Section II-ACSAD",
    focus: "Aspiring Developer",
    bio: "A passionate learner, aspiring developer, and someone who enjoys turning ideas into reality.",
    photo: "/members/kirk.png",
    filterText: "kirk stanley tan k developer",
  },
  {
    id: "romaine",
    name: "Romaine Klaire Sison",
    initials: "R.K.S.",
    avatarLetter: "R",
    avatarClass: "avatar-romaine",
    role: "Documentation Specialist & Researcher · Section II-ACSAD",
    focus: "Documentation & Research",
    bio: "As a Documentation Specialist and Researcher, I focus on uncovering user needs and translating technical workflows into clear, accessible guides—keeping both our team and our users on the same page.",
    photo: "/members/romaine.jpg",
    filterText: "romaine klaire sison r documentation specialist researcher",
  },
  {
    id: "jhonloyd",
    name: "Jhonloyd Jalea",
    initials: "J.J.",
    avatarLetter: "J",
    avatarClass: "avatar-jhonloyd",
    role: "Quality Assurance · Section II-ACSAD",
    focus: "Quality Assurance & Testing",
    bio: "Quality is my responsibility on our team. Before anything goes out, I go through it line by line, testing page features on different devices, catching typos and inconsistencies, and confirming that every requirement is met.",
    photo: "/members/jhonloyd.png",
    filterText: "jhonloyd jalea j quality assurance testing",
  },
  {
    id: "john",
    name: "John Michael Bautista",
    initials: "J.M.B.",
    avatarLetter: "J",
    avatarClass: "avatar-john",
    role: "UI/UX Designer · Section II-ACSAD",
    focus: "UI/UX Designer",
    bio: "I serve as the UI/UX Designer for our group in Section II-ACSAD, creating clear, accessible, and engaging user experiences.",
    photo: "/members/john-michael-bautista.png",
    filterText: "john michael bautista j ui ux designer",
  },
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", filterText: "overview header roster umak" },
  { id: "video-showcase", label: "Video Showcase", filterText: "video showcase embed 1min 3min" },
  { id: "theory-theorist", label: "Theory & Theorist", filterText: "theory theorist karl weick" },
  { id: "essence-reflections", label: "Reflections", filterText: "reflections essence importance footnotes" },
  { id: "commitments", label: "Commitments", filterText: "commitments discussed company" },
  { id: "company-details", label: "Company Details", filterText: "company details info profiles" },
];

export default function HomePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMemberKey, setActiveMemberKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeProfile = MEMBERS.find((m) => m.id === activeMemberKey) || null;

  // Toggle or select member spotlight
  const handleSelectMember = (id: string, forceOpen = false) => {
    if (activeMemberKey === id && !forceOpen) {
      setActiveMemberKey(null);
    } else {
      setActiveMemberKey(id);
    }
  };

  const handleSidebarMemberClick = (id: string) => {
    handleSelectMember(id, true);
    setIsMobileMenuOpen(false);
    const overviewEl = document.getElementById("overview");
    if (overviewEl) {
      overviewEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Keyboard shortcut '/' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== "INPUT" && activeTag !== "TEXTAREA") {
          e.preventDefault();
          setIsSidebarCollapsed(false);
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // IntersectionObserver for tracking active section
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0.15, 0.4, 0.7],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const query = searchQuery.trim().toLowerCase();

  return (
    <>
      <a href="#main-heading" className="skip-link">
        Skip to main content
      </a>

      <div className={`app-shell ${isSidebarCollapsed ? "is-sidebar-collapsed" : ""}`}>
        {/* Left Sidebar */}
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-workspace-bar">
            <div className="workspace-card">
              <span className="workspace-avatar" aria-hidden="true">
                OC
              </span>
              <div className="workspace-meta">
                <span className="workspace-name">ORGCOM</span>
                <span className="workspace-sub">UMak · Section II-ACSAD</span>
              </div>
              <button
                type="button"
                className="collapse-sidebar-btn"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-expanded={!isSidebarCollapsed}
                aria-controls="sidebar"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 17l-5-5 5-5" />
                  <path d="M6 12h12" />
                  <path d="M3 5v14" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="nav-toggle"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span>Menu</span>
            </button>
          </div>

          <div className={`sidebar-drawer ${isMobileMenuOpen ? "is-open" : ""}`} id="primary-nav-drawer">
            <div className="sidebar-search">
              <label htmlFor="sidebar-search-input" className="visually-hidden">
                Search sections or team members
              </label>
              <div className="search-field">
                <svg
                  aria-hidden="true"
                  className="search-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  id="sidebar-search-input"
                  className="search-input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
                <kbd className="search-kbd" aria-hidden="true">
                  /
                </kbd>
              </div>
            </div>

            <nav className="primary-nav" aria-label="Primary">
              <p className="nav-group-label">Essentials</p>
              <ul className="nav-list">
                {NAV_ITEMS.map((item) => {
                  const match =
                    query.length === 0 ||
                    item.label.toLowerCase().includes(query) ||
                    item.filterText.includes(query);
                  if (!match) return null;

                  const isCurrent = activeSection === item.id;

                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`nav-link ${isCurrent ? "target-current" : ""}`}
                        aria-current={isCurrent ? "location" : undefined}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.id === "overview" && (
                          <svg
                            aria-hidden="true"
                            className="nav-icon"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 10.5L12 3l9 7.5" />
                            <path d="M5 9.5V20h14V9.5" />
                          </svg>
                        )}
                        {item.id === "video-showcase" && (
                          <svg
                            aria-hidden="true"
                            className="nav-icon"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2.5" y="5" width="15" height="14" rx="2.5" />
                            <polygon points="21.5 8 17.5 11 17.5 13 21.5 16 21.5 8" />
                          </svg>
                        )}
                        {item.id === "theory-theorist" && (
                          <svg
                            aria-hidden="true"
                            className="nav-icon"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        )}
                        {item.id === "essence-reflections" && (
                          <svg
                            aria-hidden="true"
                            className="nav-icon"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="8" y1="13" x2="16" y2="13" />
                            <line x1="8" y1="17" x2="13" y2="17" />
                          </svg>
                        )}
                        {item.id === "commitments" && (
                          <svg
                            aria-hidden="true"
                            className="nav-icon"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" />
                            <polyline points="9 12 11 14 15 10" />
                          </svg>
                        )}
                        {item.id === "company-details" && (
                          <svg
                            aria-hidden="true"
                            className="nav-icon"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="4" y="3" width="16" height="18" rx="2" />
                            <line x1="9" y1="8" x2="10" y2="8" />
                            <line x1="14" y1="8" x2="15" y2="8" />
                            <line x1="9" y1="12" x2="10" y2="12" />
                            <line x1="14" y1="12" x2="15" y2="12" />
                            <path d="M10 21v-4h4v4" />
                          </svg>
                        )}
                        <span className="nav-label">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <hr className="sidebar-divider" />

            <details className="sidebar-group" open>
              <summary className="sidebar-group-summary">
                <span className="summary-chevron" aria-hidden="true"></span>
                <span className="summary-title">Team Members</span>
              </summary>
              <ul className="sidebar-sublist">
                {MEMBERS.map((member) => {
                  const match =
                    query.length === 0 ||
                    member.name.toLowerCase().includes(query) ||
                    member.filterText.includes(query);
                  if (!match) return null;

                  const isSelected = activeMemberKey === member.id;

                  return (
                    <li key={member.id}>
                      <button
                        type="button"
                        className={`sidebar-member-link ${isSelected ? "is-selected" : ""}`}
                        onClick={() => handleSidebarMemberClick(member.id)}
                      >
                        <span className={`badge-square ${member.avatarClass}`} aria-hidden="true">
                          {member.avatarLetter}
                        </span>
                        <span className="nav-label">{member.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </details>

            <hr className="sidebar-divider" />

            <details className="sidebar-group">
              <summary className="sidebar-group-summary">
                <span className="summary-chevron" aria-hidden="true"></span>
                <span className="summary-title">Course Info</span>
              </summary>
              <ul className="sidebar-sublist">
                <li className="info-row">
                  <span className="nav-label">University of Makati</span>
                </li>
                <li className="info-row">
                  <span className="nav-label">Section II-ACSAD · Due Nov 20</span>
                </li>
              </ul>
            </details>
          </div>
        </aside>

        {/* Main Workspace Frame */}
        <div className="workspace-frame">
          <div className="workspace-topbar">
            <p className="breadcrumb">
              <span>ORGCOM</span>
              <span aria-hidden="true">/</span>
              <span>Section II-ACSAD</span>
            </p>
            <span className="topbar-status">University of Makati · Due Nov 20</span>
          </div>

          {/* Masthead & Executive Team Roster */}
          <header className="masthead" id="overview" tabIndex={-1}>
            <div className="masthead-top">
              {/* UMak logo */}
              <div className="logo-upload-box">
                <img
                  src="/logos/umak-logo.png"
                  alt="University of Makati Logo"
                  className="logo-image"
                />
              </div>

              {/* Centered Headings */}
              <div className="masthead-center">
                <h1 id="main-heading" className="org-heading-primary" tabIndex={-1}>
                  ORGCOM
                </h1>
                <h2 className="org-heading-secondary">
                  Organizational Communication · Section II-ACSAD
                </h2>
                <p className="masthead-subtitle">
                  Organizational Communication, Section II-ACSAD, University of Makati.
                </p>
              </div>

              {/* Company logo */}
              <div className="logo-upload-box">
                <img
                  src="/assets/company-logo.png"
                  alt=""
                  className="logo-image"
                />
              </div>
            </div>

            {/* Executive Team Roster Row */}
            <div className="member-line-wrapper" aria-label="Executive Team Roster">
              <div className="member-line-header">
                <span className="member-line-label">Executive Team Roster</span>
                <span className="member-line-hint">Click a name to expand photo and description</span>
              </div>

              <div className="member-hairline-bar" role="group" aria-label="Team members">
                {MEMBERS.map((member) => {
                  const isExpanded = activeMemberKey === member.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      className="member-chip"
                      onClick={() => handleSelectMember(member.id)}
                      aria-expanded={isExpanded}
                      aria-controls="member-spotlight"
                    >
                      <span>{member.name}</span>
                      <span className="chip-indicator" aria-hidden="true">
                        +
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Expandable Member Card */}
              <div
                className="member-drawer-grid"
                id="member-spotlight"
                data-open={activeMemberKey !== null ? "true" : "false"}
                hidden={activeMemberKey === null}
              >
                <div className="member-drawer-inner">
                  {activeProfile && (
                    <article className="member-spotlight-card" aria-live="polite">
                      <div className="member-photo-frame">
                        {activeProfile.photo ? (
                          <img
                            src={activeProfile.photo}
                            alt={activeProfile.name}
                            className="member-photo-img"
                          />
                        ) : (
                          <div
                            className="photo-placeholder-box"
                            role="img"
                            aria-label="Member photo upload placeholder"
                          >
                            {activeProfile.id === "john" ? (
                              <span className="photo-name">{activeProfile.name}</span>
                            ) : (
                              <>
                                <span
                                  className={`photo-initials-circle ${activeProfile.avatarClass}`}
                                  id="spotlight-avatar-circle"
                                >
                                  {activeProfile.avatarLetter}
                                </span>
                                <span className="photo-slot-label">Photo Slot</span>
                                <span className="photo-slot-label">Upload member photo</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="spotlight-top-row">
                          <div>
                            <p className="spotlight-role" id="spotlight-role">
                              {activeProfile.role}
                            </p>
                            <h3 className="spotlight-name" id="spotlight-name">
                              {activeProfile.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            className="close-drawer-btn"
                            id="close-member-drawer"
                            onClick={() => setActiveMemberKey(null)}
                            aria-label="Collapse member profile"
                          >
                            Close
                          </button>
                        </div>
                        <p className="spotlight-bio" id="spotlight-bio">
                          {activeProfile.bio}
                        </p>
                        <dl className="spotlight-meta">
                          <div>
                            <dt>Initials</dt>
                            <dd id="spotlight-initials">{activeProfile.initials}</dd>
                          </div>
                          <div>
                            <dt>Assigned Focus</dt>
                            <dd id="spotlight-focus">{activeProfile.focus}</dd>
                          </div>
                          <div>
                            <dt>Section</dt>
                            <dd>Section II-ACSAD · UMak</dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="main-sections">
            {/* 1. Video Showcase */}
            <section className="section-block" id="video-showcase" tabIndex={-1}>
              <div className="section-head">
                <h2 className="section-title">Video Showcase</h2>
                <span className="section-tag">1 min min – 3 min max</span>
              </div>
              <p className="section-lead">
                A short 1 to 3 minute video introducing our group, our company idea, and how we communicate as a team.
              </p>

              <div className="video-stage" role="group" aria-label="ORGCOM video showcase, 16 by 9 aspect ratio">
                <video
                  className="video-player"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source src="/videos/orgcom.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="caption-note">Duration requirement: 1 minute minimum, 3 minutes maximum.</p>

              <details className="transcript-box">
                <summary>Video Outline</summary>
                <div className="transcript-content">
                  <p>
                    <strong>0:00 – 0:35:</strong> Team introduction and overview of our organization.
                  </p>
                  <p>
                    <strong>0:35 – 1:45:</strong> Summary of our chosen communication theory and company commitments.
                  </p>
                  <p>
                    <strong>1:45 – 2:30:</strong> Closing remarks and takeaways from OrgCom.
                  </p>
                </div>
              </details>
            </section>

            {/* 2. Theory & Theorist */}
            <section className="section-block" id="theory-theorist" tabIndex={-1}>
              <div className="section-head">
                <h2 className="section-title">Theory &amp; Theorist</h2>
                <span className="section-tag">1 Theory · 1 Theorist</span>
              </div>
              <p className="section-lead">
                One organizational communication theory and the theorist that best fits how our group works.
              </p>

              <div className="theorist-layout">
                <figure className="theorist-portrait-card">
                  <div className="theorist-photo-box" role="img" aria-label="Theorist photo upload placeholder">
                    <strong>Theorist Photo</strong>
                    <span>Upload portrait of Karl E. Weick (or your chosen theorist)</span>
                  </div>
                  <figcaption className="theorist-caption">
                    Karl E. Weick (Placeholder)
                  </figcaption>
                </figure>

                <div className="theorist-content">
                  <article className="theory-discussion">
                    <span className="sub-label">Brief Discussion of the Theory</span>
                    <h3>Organizational Sensemaking Theory</h3>
                    <p>
                      Karl E. Weick&apos;s Sensemaking Theory explains how people inside an organization make sense of
                      unclear or changing situations by talking and sharing information with one another. Instead of
                      looking at an organization as just a static chart, the theory focuses on how daily communication
                      helps members agree on what is happening and decide what to do next.
                    </p>
                  </article>

                  <div className="why-him-block">
                    <span className="sub-label">Why Him</span>
                    <h3>Why Karl Weick Represents Our Organization</h3>
                    <p>
                      We chose Karl Weick because our group relies on open discussion whenever we plan tasks, solve
                      problems, or adjust to deadlines. His idea of building shared understanding through communication
                      matches how we coordinate our work as a team.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Reflections */}
            <section className="section-block" id="essence-reflections" tabIndex={-1}>
              <div className="section-head">
                <h2 className="section-title">Reflections</h2>
                <span className="section-tag">Min. 5 Sentences + Footnote Each</span>
              </div>
              <p className="section-lead">
                Why Organizational Communication matters to us, followed by each member&apos;s reflection and footnote.
              </p>

              <div className="essence-block">
                <h3>Importance and Essence of Organizational Communication</h3>
                <p>
                  Organizational Communication helps us understand how clear messages, active listening, and feedback
                  keep a team or company working well together. It shows that good communication is not only about
                  speaking well, but also about building trust, preventing misunderstandings, and making sure everyone
                  shares the same goals.
                </p>
              </div>

              <h3 className="subsection-heading">Member Reflections</h3>
              <div className="reflections-grid">
                <article className="reflection-card">
                  <header className="reflection-header">
                    <span className="reflection-initials avatar-jemkirk" aria-hidden="true">
                      J
                    </span>
                    <div>
                      <h4>Jemkirk Utana</h4>
                      <p className="reflection-role">Member 1</p>
                    </div>
                  </header>
                  <p className="reflection-body">
                    Taking Organizational Communication changed how I look at working inside a team or company. Before
                    this subject, I thought leadership was mostly about giving instructions from the top. Through our
                    lessons, I learned that teams perform better when everyone can share feedback openly and
                    respectfully. Studying communication theories also helped me see how misunderstandings start and
                    how we can prevent them early. Overall, this course gave me practical habits I can carry into my
                    future workplace.
                  </p>
                  <footer className="reflection-footnote">
                    <span className="fn-mark">¹</span>
                    <p>
                      <strong>Footnote by Jemkirk Utana:</strong> Good teamwork starts when people listen before they
                      respond.
                    </p>
                  </footer>
                </article>

                <article className="reflection-card">
                  <header className="reflection-header">
                    <span className="reflection-initials avatar-kirk" aria-hidden="true">
                      K
                    </span>
                    <div>
                      <h4>Kirk Stanley Tan</h4>
                      <p className="reflection-role">Member 2</p>
                    </div>
                  </header>
                  <p className="reflection-body">
                    Organizational Communication showed me how everyday messages shape the culture of a group. While
                    working on our projects, I realized that keeping instructions clear saves time and avoids
                    confusion among teammates. Learning about formal and informal communication channels also helped me
                    understand why transparency matters in a company. Looking at different organizational theorists
                    gave me a helpful way to analyze real workplace situations. I plan to apply these communication
                    skills in every group and job I join after graduation.
                  </p>
                  <footer className="reflection-footnote">
                    <span className="fn-mark">²</span>
                    <p>
                      <strong>Footnote by Kirk Stanley Tan:</strong> Clear communication keeps both design work and
                      team goals aligned.
                    </p>
                  </footer>
                </article>

                <article className="reflection-card">
                  <header className="reflection-header">
                    <span className="reflection-initials avatar-romaine" aria-hidden="true">
                      R
                    </span>
                    <div>
                      <h4>Romaine Klaire Sison</h4>
                      <p className="reflection-role">Member 3</p>
                    </div>
                  </header>
                  <p className="reflection-body">
                    Before taking OrgCom, I did not realize how much internal communication affects morale and
                    productivity. Each topic reminded me that clear dialogue connects company plans to daily work. I
                    especially appreciated learning how different leadership styles encourage people to speak up
                    without fear. Collaborating with our team on this page also taught me how to give helpful feedback
                    while staying respectful. This subject gave me stronger confidence when sharing ideas in both class
                    and professional settings.
                  </p>
                  <footer className="reflection-footnote">
                    <span className="fn-mark">³</span>
                    <p>
                      <strong>Footnote by Romaine Klaire Sison:</strong> Listening well is just as important as speaking
                      clearly.
                    </p>
                  </footer>
                </article>

                <article className="reflection-card">
                  <header className="reflection-header">
                    <span className="reflection-initials avatar-jhonloyd" aria-hidden="true">
                      J
                    </span>
                    <div>
                      <h4>Jhonloyd Jalea</h4>
                      <p className="reflection-role">Member 4</p>
                    </div>
                  </header>
                  <p className="reflection-body">
                    This course connected classroom lessons to real challenges that employees and managers face every
                    day. I learned that careful documentation and active listening protect teams from costly mistakes.
                    Discussing real company commitments showed me that organizations earn trust when their actions match
                    their words. Working with my groupmates also helped me communicate more clearly when we had tight
                    deadlines. In the end, OrgCom taught me that healthy organizations depend on honest, respectful
                    communication.
                  </p>
                  <footer className="reflection-footnote">
                    <span className="fn-mark">⁴</span>
                    <p>
                      <strong>Footnote by Jhonloyd Jalea:</strong> Consistency between words and actions builds lasting
                      trust.
                    </p>
                  </footer>
                </article>

                <article className="reflection-card">
                  <header className="reflection-header">
                    <span className="reflection-initials avatar-john" aria-hidden="true">
                      J
                    </span>
                    <div>
                      <h4>John Michael Bautista</h4>
                      <p className="reflection-role">Member 5</p>
                    </div>
                  </header>
                  <p className="reflection-body">
                    Studying Organizational Communication gave me a clearer view of how companies present themselves
                    to people inside and outside the organization. Planning our short video required organizing our
                    ideas so viewers could understand our message in under three minutes. Through that task, I noticed
                    how tone, pacing, and clear structure affect how an audience responds. Our group discussions also
                    showed me that transparency helps teammates stay focused on the same goal. This subcourse gave me
                    communication standards that I can rely on in any future career.
                  </p>
                  <footer className="reflection-footnote">
                    <span className="fn-mark">⁵</span>
                    <p>
                      <strong>Footnote by John Michael Bautista:</strong> A clear message is easier to remember and
                      act on.
                    </p>
                  </footer>
                </article>
              </div>
            </section>

            {/* 4. Commitments */}
            <section className="section-block" id="commitments" tabIndex={-1}>
              <div className="section-head">
                <h2 className="section-title">Commitments</h2>
              </div>
              <p className="section-lead">
                The main commitments our group agreed on during our company discussions.
              </p>

              <div className="commitments-grid">
                <article className="commitment-item">
                  <span className="commitment-num">01</span>
                  <h3>Open Internal Communication</h3>
                  <p>
                    Keep team updates clear and honest so questions, blockers, and feedback are addressed early.
                  </p>
                </article>
                <article className="commitment-item">
                  <span className="commitment-num">02</span>
                  <h3>Accountability on Deadlines</h3>
                  <p>
                    Finish assigned tasks on time and communicate right away whenever someone needs support.
                  </p>
                </article>
                <article className="commitment-item">
                  <span className="commitment-num">03</span>
                  <h3>Respectful Collaboration</h3>
                  <p>
                    Listen to every member&apos;s input during planning and treat disagreements constructively.
                  </p>
                </article>
                <article className="commitment-item">
                  <span className="commitment-num">04</span>
                  <h3>Clear External Messaging</h3>
                  <p>
                    Present accurate company information and uphold honest communication with clients and stakeholders.
                  </p>
                </article>
              </div>
            </section>

            {/* 5. Company Details */}
            <section className="section-block" id="company-details" tabIndex={-1}>
              <div className="section-head">
                <h2 className="section-title">Company Details</h2>
              </div>
              <p className="section-lead">
                Basic profile and background information about our featured companies.
              </p>

              <div className="companies-grid">
                <article className="company-profile-card">
                  <div className="company-card-top">
                    <span className="company-label">Our Company</span>
                    <h3>[Insert Company Name]</h3>
                  </div>
                  <dl className="company-facts">
                    <div>
                      <dt>Industry / Focus</dt>
                      <dd>[Insert industry or business focus]</dd>
                    </div>
                    <div>
                      <dt>Members</dt>
                      <dd>
                        Jemkirk Utana, Kirk Stanley Tan, Romaine Klaire Sison, Jhonloyd Jalea, John Michael Bautista
                      </dd>
                    </div>
                    <div>
                      <dt>Mission</dt>
                      <dd>[Insert short company mission statement]</dd>
                    </div>
                    <div>
                      <dt>Location &amp; Contact</dt>
                      <dd>Makati City · [Insert email or contact details]</dd>
                    </div>
                  </dl>
                </article>

                <article className="company-profile-card">
                  <div className="company-card-top">
                    <span className="company-label">Discussed Company</span>
                    <h3>[Insert Partner / Case Company Name]</h3>
                  </div>
                  <dl className="company-facts">
                    <div>
                      <dt>Sector</dt>
                      <dd>[Insert sector or industry]</dd>
                    </div>
                    <div>
                      <dt>Structure</dt>
                      <dd>[Insert brief summary of team or organizational setup]</dd>
                    </div>
                    <div>
                      <dt>Communication Practice</dt>
                      <dd>[Insert discussed company practices and communication highlights]</dd>
                    </div>
                    <div>
                      <dt>Reference</dt>
                      <dd>[Insert website or source notes]</dd>
                    </div>
                  </dl>
                </article>
              </div>
            </section>
          </main>

          <footer className="site-footer">
            <p>
              <strong>ORGCOM · Section II-ACSAD</strong> — University of Makati
            </p>
            <p className="footer-sub">
              Jemkirk Utana · Kirk Stanley Tan · Romaine Klaire Sison · Jhonloyd Jalea · John Michael Bautista
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
