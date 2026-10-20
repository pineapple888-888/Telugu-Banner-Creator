export type FestivalId = 'ugadi' | 'sankranti' | 'dasara' | 'deepavali' | 'vinayaka' | 'bathukamma';

export type AspectRatioType = '1:1' | '9:16' | '16:9';

export type FontFamilyType = 'Noto Sans Telugu' | 'Ramabhadra' | 'Gurajada' | 'Outfit';

export interface PresetWish {
  id: string;
  titleTe: string;
  titleEn: string;
  messageTe: string;
  messageEn: string;
  subtextTe: string;
  subtextEn: string;
  tone: 'traditional' | 'poetic' | 'family' | 'devotional';
}

export interface FestivalConfig {
  id: FestivalId;
  nameTe: string;
  nameEn: string;
  taglineTe: string;
  taglineEn: string;
  image: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  gradient: [string, string, string];
  symbol: string;
  defaultTitleTe: string;
  defaultTitleEn: string;
  defaultMessageTe: string;
  defaultMessageEn: string;
  defaultSubtextTe: string;
  defaultSubtextEn: string;
  presets: PresetWish[];
}

export interface BannerState {
  festivalId: FestivalId;
  language: 'te' | 'en';
  aspectRatio: AspectRatioType;
  title: string;
  message: string;
  subtext: string;
  senderName: string;
  senderTitle: string;
  fontFamily: FontFamilyType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showToran: boolean;
  showBorders: boolean;
  showMuggu: boolean;
  showDiyas: boolean;
  showSymbol: boolean;
  photoUrl: string | null;
  photoShape: 'circle' | 'arch';
  bgOpacity: number;
}
