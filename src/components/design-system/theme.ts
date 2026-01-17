export const SPACING = {
  8: '8px',
  12: '12px',
  16: '16px',
  24: '24px',
} as const;

export const RADIUS = {
  small: '12px',   // 12px
  medium: '16px',  // 16px
  large: '20px',   // 20px
  modal: '24px',   // 24px
} as const;

export const TYPOGRAPHY = {
  h1: "text-[30px] md:text-[32px] font-bold leading-tight",
  h2: "text-[22px] md:text-[24px] font-bold leading-snug",
  body: "text-[15px] md:text-[16px] leading-normal",
  helper: "text-[13px] md:text-[14px] text-muted-foreground",
  label: "text-[13px] md:text-[14px] font-medium text-muted-foreground uppercase tracking-wider",
} as const;

export const COLORS = {
  brand: '#6b4423',
  cream: '#fdfaf7',
} as const;
