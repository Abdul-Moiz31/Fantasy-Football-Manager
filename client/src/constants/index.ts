export const TEAM_CONSTRAINTS = {
  MAX_PLAYERS: 25,
  MIN_PLAYERS: 15,
  DEFAULT_BUDGET: 5000000,
  MARKET_DISCOUNT: 0.95
} as const;

export const COLORS = {
  primary: '#2E7D32',
  primaryHover: '#1B5E20',
  secondary: '#43A047',
  secondaryHover: '#43A047/90',
  text: '#424242',
  textMuted: '#424242/70',
  border: '#E0E0E0',
  background: '#F5F5F5',
  success: '#43A047',
  error: '#D32F2F',
  warning: '#E53935'
} as const;

export const AUTH_STATS = {
  ACTIVE_PLAYERS: '50K+',
  PRIZE_POOL: '$100K',
  SECURITY: '100%'
} as const;

export const ROUTES = {
  HOME: '/',
  MARKET: '/market',
  TEAM: '/team',
  AUTH: '/auth'
} as const;

export const UI_COLORS = {
  ...COLORS, // extend existing colors
  blue: '#1976D2',
  orange: '#FF9800',
  warningBg: '#FFF3CD',
  warningBorder: '#FFEAA7',
  warningText: '#856404',
  gray: '#E0E0E0',
  grayHover: '#BDBDBD',
  lightGreen: '#E8F5E9',
} as const;

export const POSITION_CONFIG = [
  { key: "Goalkeeper", label: "Goalkeepers", color: UI_COLORS.primary },
  { key: "Defender", label: "Defenders", color: UI_COLORS.blue },
  { key: "Midfielder", label: "Midfielders", color: UI_COLORS.secondary },
  { key: "Forward", label: "Forwards", color: UI_COLORS.orange },
] as const;

export const INTERVALS = {
  teamRefresh: 10000, // 10 seconds
  debounce: 500, // 500ms
  toastDuration: 3000, // 3 seconds
} as const;

export const THRESHOLDS = {
  lowBudget: 50000, // $50k
  marketDiscount: 0.95, // 95%
} as const;

export const PAGE_MESSAGES = {
  home: {
    title: "Dashboard",
    subtitle: "Manage your fantasy football team",
  },
  team: {
    title: "My Team",
    subtitle: "The Rising Stars of the League",
    loadingMessage: "Loading your team...",
    minPlayersWarning: "You cannot list any more players because you have reached minimum count.",
  },
  market: {
    title: "Market Place",
    subtitle: `Buy and sell players at ${TEAM_CONSTRAINTS.MARKET_DISCOUNT * 100}% of their value`,
    loadingMessage: "Loading market listings...",
    teamFullWarning: "You must sell a player before buying more.",
    lowBudgetWarning: "You may not be able to afford many players. Consider selling some players to increase your budget.",
  },
} as const;