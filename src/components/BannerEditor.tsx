import React, { useRef } from 'react';
import { BannerState, FestivalConfig, FontFamilyType, PresetWish } from '../types';
import { TELUGU_QUICK_PHRASES } from '../data/festivals';
import { Sparkles, Upload, Trash2, Sliders, Type, BookOpen, Image as ImageIcon } from 'lucide-react';

interface BannerEditorProps {
  bannerState: BannerState;
  festival: FestivalConfig;
  language: 'te' | 'en';
  onUpdateState: <K extends keyof BannerState>(key: K, value: BannerState[K]) => void;
  onApplyPreset: (preset: PresetWish) => void;
  onOpenAiModal: () => void;
}

export const BannerEditor: React.FC<BannerEditorProps> = ({
  bannerState,
  festival,
  language,
  onUpdateState,
  onApplyPreset,
  onOpenAiModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateState('photoUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    onUpdateState('photoUrl', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertPhrase = (phrase: string, targetField: 'title' | 'message' | 'subtext') => {
    const current = bannerState[targetField];
    const updated = current ? `${current} ${phrase}` : phrase;
    onUpdateState(targetField, updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with AI generator trigger banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-amber-900/40 border border-amber-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'te' ? 'AI ప్రత్యేక శుభాకాంక్షలు' : 'Generate Custom Wishes with AI'}</span>
          </div>
          <p className="text-xs text-amber-100/70 mt-0.5">
            {language === 'te'
              ? 'మీ కుటుంబం లేదా సంస్థ పేరుతో ఆకర్షణీయమైన తెలుగు కవితలు, ఆశీర్వచనాలు సృష్టించండి'
              : 'Create personalized poetic Telugu or English greetings with Gemini'}
          </p>
        </div>
        <button
          onClick={onOpenAiModal}
          className="min-h-[40px] px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'te' ? 'AIతో రచించండి' : 'Create with AI'}</span>
        </button>
      </div>

      {/* 2. Text Content Fields */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              {language === 'te' ? 'శుభాకాంక్షల సమాచారం' : 'Greeting Text & Content'}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {language === 'te' ? 'తెలుగు / English' : 'Bilingual Support'}
          </span>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {language === 'te' ? 'ప్రధాన శీర్షిక (Title)' : 'Banner Headline / Title'}
          </label>
          <input
            type="text"
            value={bannerState.title}
            onChange={(e) => onUpdateState('title', e.target.value)}
            placeholder={festival.defaultTitleTe}
            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
          />
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {language === 'te' ? 'పండుగ సందేశం (Main Message)' : 'Main Greeting Message'}
          </label>
          <textarea
            rows={3}
            value={bannerState.message}
            onChange={(e) => onUpdateState('message', e.target.value)}
            placeholder={festival.defaultMessageTe}
            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-y"
          />
        </div>

        {/* Quick Telugu Words helper */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-stone-500">
            {language === 'te' ? 'త్వరిత తెలుగు పదాలు (క్లిక్ చేసి జోడించండి):' : 'Quick Telugu phrases:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TELUGU_QUICK_PHRASES.slice(0, 6).map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => insertPhrase(phrase, 'message')}
                className="px-2 py-1 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md border border-amber-200 transition-colors"
              >
                + {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Subtext Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {language === 'te' ? 'శుభాశీస్సులు / ఉప శీర్షిక (Subtext)' : 'Auspicious Subtext / Blessing'}
          </label>
          <input
            type="text"
            value={bannerState.subtext}
            onChange={(e) => onUpdateState('subtext', e.target.value)}
            placeholder={festival.defaultSubtextTe}
            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
          />
        </div>

        {/* Sender Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'te' ? 'ఇట్లు: పేరు / కుటుంబం (Sender Name)' : 'With Best Compliments: Name'}
            </label>
            <input
              type="text"
              value={bannerState.senderName}
              onChange={(e) => onUpdateState('senderName', e.target.value)}
              placeholder={language === 'te' ? 'ఉదా: మీ రాధా మాధవి & కుటుంబ సభ్యులు' : 'e.g. Radhamadhavi & Family'}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'te' ? 'హోదా / ఊరు (Designation / City)' : 'Designation / Location'}
            </label>
            <input
              type="text"
              value={bannerState.senderTitle}
              onChange={(e) => onUpdateState('senderTitle', e.target.value)}
              placeholder={language === 'te' ? 'హైదరాబాద్ / Vijayawada' : 'Hyderabad / Company Name'}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Photo & Sender Badge Upload */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              {language === 'te' ? 'మీ ఫోటో / లోగో జోడించండి' : 'Add Sender Photo or Logo'}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {language === 'te' ? 'ఐచ్ఛికం (Optional)' : 'Optional'}
          </span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        {bannerState.photoUrl ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center gap-3">
              <img
                src={bannerState.photoUrl}
                alt="Sender preview"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500"
              />
              <div>
                <p className="text-xs font-semibold text-stone-900">
                  {language === 'te' ? 'ఫోటో అమర్చబడింది' : 'Photo Attached'}
                </p>
                <p className="text-[11px] text-stone-500">
                  {language === 'te' ? 'బ్యానర్‌లో బంగారు ఫ్రేమ్‌లో కనిపిస్తుంది' : 'Rendered in golden frame on banner'}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemovePhoto}
              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[48px] py-3 px-4 border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-xl flex items-center justify-center gap-2 text-stone-600 hover:text-amber-800 transition-colors bg-stone-50/50 hover:bg-amber-50/30"
          >
            <Upload className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold">
              {language === 'te'
                ? 'వ్యక్తిగత లేదా కుటుంబ ఫోటో అప్‌లోడ్ చేయండి'
                : 'Upload Personal or Family Photo'}
            </span>
          </button>
        )}
      </div>

      {/* 4. Traditional Design Themes & Elements */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              {language === 'te' ? 'సాంప్రదాయ అలంకరణలు' : 'Traditional Themes & Ornaments'}
            </h3>
          </div>
        </div>

        {/* Font Family Selection */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            {language === 'te' ? 'తెలుగు ఫాంట్ శైలి (Typography)' : 'Typography Font Style'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'Noto Sans Telugu', label: 'Noto Sans', desc: 'Modern Clean' },
                { id: 'Ramabhadra', label: 'రామభద్ర', desc: 'Classic Bold' },
                { id: 'Gurajada', label: 'గురజాడ', desc: 'Artistic Script' },
                { id: 'Outfit', label: 'Outfit', desc: 'Modern English' },
              ] as { id: FontFamilyType; label: string; desc: string }[]
            ).map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => onUpdateState('fontFamily', font.id)}
                className={`p-2.5 rounded-lg border text-left transition-all min-h-[44px] ${
                  bannerState.fontFamily === font.id
                    ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-500/50'
                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/50'
                }`}
              >
                <p className="text-xs font-bold text-stone-900" style={{ fontFamily: font.id }}>
                  {font.label}
                </p>
                <p className="text-[10px] text-stone-500">{font.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Ornaments Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              checked={bannerState.showToran}
              onChange={(e) => onUpdateState('showToran', e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 border-stone-300"
            />
            <span className="text-xs font-medium text-stone-700">
              {language === 'te' ? 'మామిడి తోరణం' : 'Mango Toran'}
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              checked={bannerState.showBorders}
              onChange={(e) => onUpdateState('showBorders', e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 border-stone-300"
            />
            <span className="text-xs font-medium text-stone-700">
              {language === 'te' ? 'బంగారు అంచు' : 'Gold Border'}
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              checked={bannerState.showMuggu}
              onChange={(e) => onUpdateState('showMuggu', e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 border-stone-300"
            />
            <span className="text-xs font-medium text-stone-700">
              {language === 'te' ? 'ముగ్గు డిజైన్' : 'Rice Muggu'}
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              checked={bannerState.showDiyas}
              onChange={(e) => onUpdateState('showDiyas', e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 border-stone-300"
            />
            <span className="text-xs font-medium text-stone-700">
              {language === 'te' ? 'దివ్య దీపాలు' : 'Brass Diyas'}
            </span>
          </label>
        </div>
      </div>

      {/* 5. Authentic Preset Greetings Gallery */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              {language === 'te' ? 'సిద్ధంగా ఉన్న సాంప్రదాయ శుభాకాంక్షలు' : 'Preset Traditional Greetings'}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {language === 'te' ? 'ఒక క్లిక్‌తో ఎంచుకోండి' : 'Click to apply'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {festival.presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="text-left p-3 rounded-lg border border-stone-200 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/40 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 truncate">
                  {language === 'te' ? preset.titleTe : preset.titleEn}
                </span>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                  {preset.tone}
                </span>
              </div>
              <p className="text-xs text-stone-600 line-clamp-2">
                {language === 'te' ? preset.messageTe : preset.messageEn}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
