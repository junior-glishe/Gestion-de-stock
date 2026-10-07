/* Toutes les icônes SVG du projet (trait 1.8, style héroïs). */

const createIcon = (children) =>
  function Icon({ className = 'h-5 w-5 shrink-0' }) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }

/* ---------- Espace de gestion ---------- */
export const IconDashboard = createIcon(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1.6" />
    <rect x="14" y="3" width="7" height="5" rx="1.6" />
    <rect x="14" y="12" width="7" height="9" rx="1.6" />
    <rect x="3" y="16" width="7" height="5" rx="1.6" />
  </>,
)

export const IconBox = createIcon(
  <>
    <path d="m7.5 4.3 9 5.1" />
    <path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </>,
)

export const IconTag = createIcon(
  <>
    <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" />
    <circle cx="7.4" cy="7.4" r="1.2" />
  </>,
)

export const IconTruck = createIcon(
  <>
    <path d="M14 17.5V6.2a1 1 0 0 0-1-1H2.8a1 1 0 0 0-1 1v10.3a1 1 0 0 0 1 1H4" />
    <path d="M14 9h3.6l3.4 3.6v3.9a1 1 0 0 1-1 1H19" />
    <circle cx="7" cy="17.5" r="2.1" />
    <circle cx="17" cy="17.5" r="2.1" />
    <path d="M9.1 17.5h5.8" />
  </>,
)

export const IconEntry = createIcon(
  <>
    <path d="M12 3.2v11.3" />
    <path d="m7.6 10.4 4.4 4.4 4.4-4.4" />
    <path d="M4 16.6v2.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.2" />
  </>,
)

export const IconExit = createIcon(
  <>
    <path d="M12 14.5V3.2" />
    <path d="m7.6 7.3 4.4-4.4 4.4 4.4" />
    <path d="M4 16.6v2.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.2" />
  </>,
)

export const IconBell = createIcon(
  <>
    <path d="M10.3 21a2 2 0 0 0 3.4 0" />
    <path d="M3.3 15.3A1 1 0 0 0 4 17h16a1 1 0 0 0 .7-1.7C19.4 14 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.4 6-2.7 7.3" />
  </>,
)

export const IconClipboard = createIcon(
  <>
    <rect width="8" height="4" x="8" y="2" rx="1.4" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M8.6 11.5h6.8" />
    <path d="M8.6 16h6.8" />
  </>,
)

export const IconChart = createIcon(
  <>
    <path d="M3 3.2v15.6a2 2 0 0 0 2 2h15.8" />
    <path d="M18.2 17.4V9" />
    <path d="M13.1 17.4V5.4" />
    <path d="M8 17.4v-3.6" />
  </>,
)

export const IconUsers = createIcon(
  <>
    <path d="M16 20.8V19a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1.8" />
    <circle cx="9" cy="7.2" r="3.9" />
    <path d="M22 20.8V19a4 4 0 0 0-3-3.9" />
    <path d="M16 3.4a4 4 0 0 1 0 7.5" />
  </>,
)

export const IconShield = createIcon(
  <>
    <path d="M20 12.8c0 5-3.5 7.6-7.7 9.1a1 1 0 0 1-.6 0C7.5 20.4 4 17.8 4 12.8V6.2a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 4 17 5.2 19 5.2a1 1 0 0 1 1 1Z" />
    <path d="m9.4 11.9 1.9 1.9 3.4-3.7" />
  </>,
)

export const IconSearch = createIcon(
  <>
    <circle cx="11" cy="11" r="7.4" />
    <path d="m20.8 20.8-4.2-4.2" />
  </>,
)

export const IconMenu = createIcon(
  <>
    <path d="M4 6.5h16" />
    <path d="M4 12h16" />
    <path d="M4 17.5h16" />
  </>,
)

export const IconPanel = createIcon(
  <>
    <rect width="18" height="18" x="3" y="3" rx="2.6" />
    <path d="M9.6 3v18" />
  </>,
)

export const IconLogout = createIcon(
  <>
    <path d="m16 16.5 4.5-4.5L16 7.5" />
    <path d="M20.5 12H9.5" />
    <path d="M9.5 20.5h-4a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h4" />
  </>,
)

export const IconClose = createIcon(
  <>
    <path d="M18.2 5.8 5.8 18.2" />
    <path d="m5.8 5.8 12.4 12.4" />
  </>,
)

export const IconPlus = createIcon(
  <>
    <path d="M5.2 12h13.6" />
    <path d="M12 5.2v13.6" />
  </>,
)

export const IconCheck = createIcon(<path d="m20 6.4-10.6 11L4 11.9" />)

export const IconAlert = createIcon(
  <>
    <path d="M12 9.2v4" />
    <path d="M12 17.2h.01" />
    <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0" />
  </>,
)

export const IconEdit = createIcon(
  <>
    <path d="M11 4.2H4.6a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h13.2a2 2 0 0 0 2-2V13" />
    <path d="M18.2 2.6a2 2 0 0 1 2.8 2.8L12.4 14l-4 1 1-4Z" />
  </>,
)

export const IconTrash = createIcon(
  <>
    <path d="M3.4 6.2h17.2" />
    <path d="M8.4 6.2V4.4a1.4 1.4 0 0 1 1.4-1.4h4.4a1.4 1.4 0 0 1 1.4 1.4v1.8" />
    <path d="M18.6 6.2v13a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-13" />
    <path d="M10.2 11v5.6" />
    <path d="M13.8 11v5.6" />
  </>,
)

export const IconReset = createIcon(
  <>
    <path d="M3.4 12a8.6 8.6 0 1 0 2.9-6.4L3.2 8.2" />
    <path d="M3.2 3.4v4.8H8" />
  </>,
)

export const IconChevron = createIcon(<path d="m9.4 18.2 5.6-6.2-5.6-6.2" />)

export const IconChevronDown = createIcon(<path d="m6 9 6 6 6-6" />)

export const IconLayers = createIcon(
  <>
    <path d="m12 2.6 9 4.8-9 4.8-9-4.8Z" />
    <path d="m3 12 9 4.8 9-4.8" />
    <path d="m3 16.8 9 4.8 9-4.8" />
  </>,
)

export const IconWallet = createIcon(
  <>
    <path d="M19 7.4V5.4a2 2 0 0 0-2-2H5.4a2 2 0 0 0 0 4h13.2a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2V5.4" />
    <circle cx="16.4" cy="13.4" r="1.2" />
  </>,
)

export const IconClock = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.8V12l3.2 2.2" />
  </>,
)

export const IconList = createIcon(
  <>
    <path d="M8.4 6.4h12.2" />
    <path d="M8.4 12h12.2" />
    <path d="M8.4 17.6h12.2" />
    <path d="M3.6 6.4h.01" />
    <path d="M3.6 12h.01" />
    <path d="M3.6 17.6h.01" />
  </>,
)

export const IconPin = createIcon(
  <>
    <path d="M19.6 10.2c0 4.8-7.6 11.4-7.6 11.4S4.4 15 4.4 10.2a7.6 7.6 0 0 1 15.2 0" />
    <circle cx="12" cy="10" r="2.7" />
  </>,
)

export const IconDatabase = createIcon(
  <>
    <ellipse cx="12" cy="5.6" rx="7.8" ry="2.9" />
    <path d="M4.2 5.6v12.8c0 1.6 3.5 2.9 7.8 2.9s7.8-1.3 7.8-2.9V5.6" />
    <path d="M4.2 12c0 1.6 3.5 2.9 7.8 2.9s7.8-1.3 7.8-2.9" />
  </>,
)

/* ---------- Landing ---------- */
export const IconArrowRight = createIcon(<path d="M5 12h14M13 6l6 6-6 6" />)

export const IconPlay = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8.5 5 3.5-5 3.5z" />
  </>,
)

export const IconMail = createIcon(
  <>
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="m3 7 9 6 9-6M12 20v-3" />
  </>,
)

export const IconDocument = createIcon(
  <>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M9 11h6M9 15h4" />
  </>,
)

export const IconFolder = createIcon(<path d="M3 6h6l2 2h10v10H3z" />)

export const IconCar = createIcon(
  <>
    <path d="M4 16v-4l2-5h12l2 5v4M4 16h16M7 19v-3M17 19v-3" />
    <circle cx="8" cy="13" r=".8" />
    <circle cx="16" cy="13" r=".8" />
  </>,
)

export const IconHelp = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.3a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.5-2.5 2.5" />
    <path d="M12 17h.01" />
  </>,
)
