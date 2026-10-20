import React from 'react';
import { Languages, Sparkles } from 'lucide-react';

interface NavbarProps {
  language: 'te' | 'en';
  onToggleLanguage: () => void;
  onOpenAiWish: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onOpenAiWish,
  activeSection,
  onSelectSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-950/95 backdrop-blur-md border-b border-amber-900/60 text-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-inner text-amber-950 font-bold text-lg select-none">
            తె
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectSection('creator');
            }}
            className="text-lg sm:text-xl font-bold tracking-tight text-amber-100 hover:text-white transition-colors whitespace-nowrap shrink-0 font-['Ramabhadra']"
          >
            {language === 'te' ? 'తెలుగు పండుగ బ్యానర్ క్రియేటర్' : 'Telugu Banner Studio'}
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-200/80">
          <button
            onClick={() => onSelectSection('festivals')}
            className={`hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'festivals' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            {language === 'te' ? 'పండుగలు' : 'Festivals'}
          </button>
          <button
            onClick={() => onSelectSection('creator')}
            className={`hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'creator' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            {language === 'te' ? 'డిజైన్ ఎడిటర్' : 'Banner Editor'}
          </button>
          <button
            onClick={() => onSelectSection('presets')}
            className={`hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'presets' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            {language === 'te' ? 'సాంప్రదాయ శుభాకాంక్షలు' : 'Preset Greetings'}
          </button>
          <button
            onClick={onOpenAiWish}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'te' ? 'AI శుభాకాంక్షలు' : 'AI Wishes'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Language Switch */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleLanguage}
            className="min-h-[44px] px-3 sm:px-4 py-2 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-700/50 text-xs sm:text-sm font-medium text-amber-200 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm active:scale-95"
            title={language === 'te' ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">{language === 'te' ? 'English' : 'తెలుగు'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
