import React, { useState } from 'react';
import { FestivalId, FestivalConfig } from '../types';
import { FESTIVALS_DATA } from '../data/festivals';
import { Sparkles, X, Check, Loader2, RefreshCw } from 'lucide-react';

interface AiWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivalId: FestivalId;
  language: 'te' | 'en';
  onSelectWish: (wish: { title: string; message: string; subtext: string }) => void;
}

interface GeneratedGreeting {
  title: string;
  message: string;
  subtext: string;
}

export const AiWishModal: React.FC<AiWishModalProps> = ({
  isOpen,
  onClose,
  festivalId: initialFestivalId,
  language: initialLanguage,
  onSelectWish,
}) => {
  const [selectedFestival, setSelectedFestival] = useState<FestivalId>(initialFestivalId);
  const [lang, setLang] = useState<'te' | 'en'>(initialLanguage);
  const [tone, setTone] = useState<'traditional' | 'poetic' | 'family' | 'devotional'>('traditional');
  const [customName, setCustomName] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [greetings, setGreetings] = useState<GeneratedGreeting[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          festival: selectedFestival,
          language: lang,
          tone,
          customName,
          customNote,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error response');
      }

      const data = await res.json();
      if (data.greetings && Array.isArray(data.greetings) && data.greetings.length > 0) {
        setGreetings(data.greetings);
      } else {
        throw new Error('No greetings generated');
      }
    } catch (err: any) {
      console.warn('API generation failed, loading rich cultural offline presets for fallback', err);
      // Fallback to high quality festival presets so the user is never stuck
      const fest = FESTIVALS_DATA[selectedFestival];
      const fallbackList: GeneratedGreeting[] = fest.presets.map((p) => ({
        title: lang === 'te' ? p.titleTe : p.titleEn,
        message: lang === 'te' ? p.messageTe : p.messageEn,
        subtext: lang === 'te' ? p.subtextTe : p.subtextEn,
      }));
      setGreetings(fallbackList);
      setErrorMsg(
        lang === 'te'
          ? 'సర్వర్ కనెక్ట్ కాకపోవడంతో ప్రామాణిక సాంప్రదాయ శుభాకాంక్షలను అందించాము.'
          : 'Showing verified traditional cultural wishes.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (item: GeneratedGreeting) => {
    onSelectWish(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 flex items-center justify-between border-b border-amber-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500 text-stone-950 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100 font-['Ramabhadra']">
                {lang === 'te' ? 'AI తెలుగు శుభాకాంక్షల రచయిత' : 'AI Festive Wish Generator'}
              </h3>
              <p className="text-xs text-amber-200/80">
                {lang === 'te'
                  ? 'జెమినీ సహాయంతో హృద్యమైన పండుగ కవితలు, ఆశీర్వాదాలు పొందండి'
                  : 'Powered by Gemini AI for personalized cultural wishes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-amber-200 hover:text-white hover:bg-amber-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Festival & Language Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'te' ? 'పండుగ' : 'Festival'}
              </label>
              <select
                value={selectedFestival}
                onChange={(e) => setSelectedFestival(e.target.value as FestivalId)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none bg-stone-50"
              >
                {Object.values(FESTIVALS_DATA).map((f) => (
                  <option key={f.id} value={f.id}>
                    {lang === 'te' ? `${f.nameTe} (${f.nameEn})` : `${f.nameEn} - ${f.nameTe}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'te' ? 'భాష' : 'Language'}
              </label>
              <div className="flex rounded-lg border border-stone-300 p-0.5 bg-stone-100">
                <button
                  type="button"
                  onClick={() => setLang('te')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    lang === 'te' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    lang === 'en' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {lang === 'te' ? 'శైలి / భావన (Tone)' : 'Tone & Flavor'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'traditional', labelTe: 'సాంప్రదాయం', labelEn: 'Traditional' },
                { id: 'poetic', labelTe: 'భావ కవితాత్మకం', labelEn: 'Poetic' },
                { id: 'family', labelTe: 'కుటుంబ ఆశీస్సులు', labelEn: 'Family Blessings' },
                { id: 'devotional', labelTe: 'భక్తిపూర్వకం', labelEn: 'Devotional' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as any)}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    tone === t.id
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {lang === 'te' ? t.labelTe : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Context Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'te' ? 'ఎవరికి / ఎవరి నుండి? (Sender / Recipient)' : 'Sender or Family Name'}
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={lang === 'te' ? 'ఉదా: మాధవి కుటుంబ సభ్యులు' : 'e.g. Madhavi & Family'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'te' ? 'ప్రత్యేక కోరిక (Optional Theme Note)' : 'Special Theme / Focus'}
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={lang === 'te' ? 'ఉదా: కొత్త ఇల్లు, ఆరోగ్యం, విజయం' : 'e.g. New Home, Health, Prosperity'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-stone-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'te' ? 'శుభాకాంక్షలను రచిస్తోంది...' : 'Crafting Poetic Wishes...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'te' ? 'శుభాకాంక్షలను రూపొందించండి' : 'Generate Festive Greetings'}</span>
              </>
            )}
          </button>

          {errorMsg && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {errorMsg}
            </p>
          )}

          {/* Output Results */}
          {greetings.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                {lang === 'te' ? 'రూపొందించబడిన శుభాకాంక్షలు (ఎంచుకోవడానికి క్లిక్ చేయండి):' : 'Generated Greetings (Click to apply):'}
              </h4>

              <div className="space-y-2.5">
                {greetings.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/40 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <h5 className="font-bold text-amber-900 text-sm">{item.title}</h5>
                      <p className="text-xs text-stone-700 mt-1 leading-relaxed">{item.message}</p>
                      {item.subtext && (
                        <p className="text-[11px] font-medium text-amber-700 mt-1.5 italic">
                          {item.subtext}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApply(item)}
                      className="self-end px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'te' ? 'ఈ బ్యానర్‌కు వర్తింపజేయి' : 'Apply to Banner'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
