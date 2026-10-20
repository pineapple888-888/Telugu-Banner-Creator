import React, { useState } from 'react';
import { FestivalId, BannerState, PresetWish, FontFamilyType } from './types';
import { FESTIVALS_DATA } from './data/festivals';
import { Navbar } from './components/Navbar';
import { FestivalSelector } from './components/FestivalSelector';
import { BannerCanvasPreview } from './components/BannerCanvasPreview';
import { BannerEditor } from './components/BannerEditor';
import { AiWishModal } from './components/AiWishModal';
import { Sparkles, Heart, Share2, Download, ShieldCheck, Palette, Layers, Award } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'te' | 'en'>('te');
  const [activeFestivalId, setActiveFestivalId] = useState<FestivalId>('ugadi');
  const [activeSection, setActiveSection] = useState<string>('creator');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const initialFestival = FESTIVALS_DATA.ugadi;

  const [bannerState, setBannerState] = useState<BannerState>({
    festivalId: 'ugadi',
    language: 'te',
    aspectRatio: '1:1',
    title: initialFestival.defaultTitleTe,
    message: initialFestival.defaultMessageTe,
    subtext: initialFestival.defaultSubtextTe,
    senderName: '',
    senderTitle: '',
    fontFamily: 'Ramabhadra',
    primaryColor: initialFestival.primaryColor,
    secondaryColor: initialFestival.secondaryColor,
    accentColor: initialFestival.accentColor,
    showToran: true,
    showBorders: true,
    showMuggu: true,
    showDiyas: true,
    showSymbol: true,
    photoUrl: null,
    photoShape: 'circle',
    bgOpacity: 0.9,
  });

  const activeFestival = FESTIVALS_DATA[activeFestivalId];

  // Handle Festival Selection
  const handleSelectFestival = (id: FestivalId) => {
    setActiveFestivalId(id);
    const fest = FESTIVALS_DATA[id];
    setBannerState((prev) => ({
      ...prev,
      festivalId: id,
      title: language === 'te' ? fest.defaultTitleTe : fest.defaultTitleEn,
      message: language === 'te' ? fest.defaultMessageTe : fest.defaultMessageEn,
      subtext: language === 'te' ? fest.defaultSubtextTe : fest.defaultSubtextEn,
      primaryColor: fest.primaryColor,
      secondaryColor: fest.secondaryColor,
      accentColor: fest.accentColor,
    }));
  };

  // Handle Language Toggle
  const handleToggleLanguage = () => {
    const newLang = language === 'te' ? 'en' : 'te';
    setLanguage(newLang);
    setBannerState((prev) => {
      const fest = FESTIVALS_DATA[prev.festivalId];
      return {
        ...prev,
        language: newLang,
        title: newLang === 'te' ? fest.defaultTitleTe : fest.defaultTitleEn,
        message: newLang === 'te' ? fest.defaultMessageTe : fest.defaultMessageEn,
        subtext: newLang === 'te' ? fest.defaultSubtextTe : fest.defaultSubtextEn,
      };
    });
  };

  const handleUpdateState = <K extends keyof BannerState>(key: K, value: BannerState[K]) => {
    setBannerState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyPreset = (preset: PresetWish) => {
    setBannerState((prev) => ({
      ...prev,
      title: language === 'te' ? preset.titleTe : preset.titleEn,
      message: language === 'te' ? preset.messageTe : preset.messageEn,
      subtext: language === 'te' ? preset.subtextTe : preset.subtextEn,
    }));
  };

  const handleSelectAiWish = (wish: { title: string; message: string; subtext: string }) => {
    setBannerState((prev) => ({
      ...prev,
      title: wish.title,
      message: wish.message,
      subtext: wish.subtext,
    }));
  };

  return (
    <div className="min-h-screen bg-stone-100/80 text-stone-900 flex flex-col font-['Noto_Sans_Telugu',sans-serif]">
      {/* Top Navigation Bar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenAiWish={() => setIsAiModalOpen(true)}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 p-6 sm:p-8 border border-amber-800/80 shadow-md">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <span className="font-['Ramabhadra']">శ్రీరస్తు · శుభమస్తు</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'te' ? 'సంప్రదాయ తెలుగు పండుగల వేదిక' : 'South Indian Festival Creator'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Ramabhadra'] leading-tight">
              {language === 'te'
                ? 'మీ కుటుంబం & స్నేహితుల కోసం పండుగ బ్యానర్లు సృష్టించండి'
                : 'Create Authentic Telugu Festival Banners'}
            </h1>
            <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed">
              {language === 'te'
                ? 'ఉగాది, సంక్రాంతి, దసరా, దీపావళి, వినాయక చవితి మరియు బతుకమ్మ పండుగలకు అందమైన తెలుగు శుభాకాంక్షలతో HD బ్యానర్లు రూపొందించి వాట్సాప్‌లో పంచుకోండి.'
                : 'Design traditional South Indian greeting banners with custom Telugu or English wishes, ornate temple borders, and instant WhatsApp sharing.'}
            </p>
          </div>

          {/* Decorative motif element */}
          <div className="absolute right-4 -bottom-6 opacity-20 pointer-events-none text-8xl sm:text-9xl font-serif select-none">
            🪔
          </div>
        </section>

        {/* Festival Selector Bar */}
        <section id="festivals" className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <FestivalSelector
            selectedFestival={activeFestivalId}
            onSelectFestival={handleSelectFestival}
            language={language}
          />
        </section>

        {/* 2-Column Responsive Studio Workspace (Desktop 2-Col, Mobile Stacked) */}
        <section id="creator" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Controls, Text & Customization (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <BannerEditor
              bannerState={bannerState}
              festival={activeFestival}
              language={language}
              onUpdateState={handleUpdateState}
              onApplyPreset={handleApplyPreset}
              onOpenAiModal={() => setIsAiModalOpen(true)}
            />
          </div>

          {/* Right Column: Sticky Live Canvas Preview + Download & WhatsApp Share (5 cols on lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <BannerCanvasPreview
              bannerState={bannerState}
              festival={activeFestival}
              language={language}
              onOpenAiWish={() => setIsAiModalOpen(true)}
              onSetAspectRatio={(ratio) => handleUpdateState('aspectRatio', ratio)}
            />

            {/* Quick Tips Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                <Share2 className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'te' ? 'షేరింగ్ సూచనలు' : 'Sharing Tips:'}</span>
              </div>
              <ul className="space-y-1 text-stone-600 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  {language === 'te'
                    ? 'మొబైల్‌లో "వాట్సాప్‌లో షేర్ చేయండి" క్లిక్ చేస్తే నేరుగా బ్యానర్ ఇమేజ్‌తో షేర్ అవుతుంది.'
                    : 'Click "Share to WhatsApp" to share the banner image directly to your contacts.'}
                </li>
                <li>
                  {language === 'te'
                    ? '9:16 సైజు WhatsApp Status మరియు Instagram Story కోసం ఉత్తమమైనది.'
                    : 'Use the 9:16 aspect ratio for WhatsApp Status and Instagram Stories.'}
                </li>
                <li>
                  {language === 'te'
                    ? '"HD బ్యానర్ డౌన్‌లోడ్" ద్వారా ప్రింట్ లేదా సోషల్ మీడియా కోసం హై-రిజల్యూషన్ PNG పొందండి.'
                    : 'Download HD Banner saves crisp 1080p+ PNG for print and high-fidelity sharing.'}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Festival Cultural Significance Cards */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-['Ramabhadra']">
              {language === 'te' ? 'సాంప్రదాయ పండుగల వైశిష్ట్యం' : 'Significance of South Indian Festivals'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {language === 'te'
                ? 'మన తెలుగు సంస్కృతి, ఆచారాలు మరియు పండుగల ప్రాముఖ్యత'
                : 'Rich cultural roots, traditions, and divine meanings behind each festival'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(FESTIVALS_DATA).map((f) => (
              <div
                key={f.id}
                onClick={() => handleSelectFestival(f.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  f.id === activeFestivalId
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/40 shadow-xs'
                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{f.symbol}</span>
                    <span className="text-[11px] font-semibold text-amber-700">
                      {f.id === activeFestivalId ? (language === 'te' ? 'ఎంపికైంది' : 'Active') : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'te' ? f.nameTe : f.nameEn}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {language === 'te' ? f.taglineTe : f.taglineEn}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-amber-800 font-semibold">
                  <span>{language === 'te' ? 'ఈ బ్యానర్ డిజైన్ చేయండి' : 'Create Banner'}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-amber-950 border-t border-amber-900/80 text-amber-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-['Ramabhadra'] font-bold text-amber-100 text-sm">
              తెలుగు పండుగ బ్యానర్ క్రియేటర్
            </span>
            <span>·</span>
            <span>Telugu Festival Banner Creator</span>
          </div>
          <div className="text-stone-400 text-center sm:text-right">
            <span>{language === 'te' ? 'ఆంధ్రప్రదేశ్ & తెలంగాణ పండుగల వేడుక' : 'Celebrating Festivals of Andhra Pradesh & Telangana'}</span>
          </div>
        </div>
      </footer>

      {/* AI Wishes Generator Modal */}
      <AiWishModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        festivalId={activeFestivalId}
        language={language}
        onSelectWish={handleSelectAiWish}
      />
    </div>
  );
}
