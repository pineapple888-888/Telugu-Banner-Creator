import React from 'react';
import { FestivalId } from '../types';
import { FESTIVALS_DATA } from '../data/festivals';
import { Check } from 'lucide-react';

interface FestivalSelectorProps {
  selectedFestival: FestivalId;
  onSelectFestival: (id: FestivalId) => void;
  language: 'te' | 'en';
}

export const FestivalSelector: React.FC<FestivalSelectorProps> = ({
  selectedFestival,
  onSelectFestival,
  language,
}) => {
  const festivalList = Object.values(FESTIVALS_DATA);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
          {language === 'te' ? 'పండుగను ఎంచుకోండి' : 'Select Festival'}
        </h2>
        <span className="text-xs text-stone-500">
          {language === 'te' ? '6 సాంప్రదాయ పండుగలు' : '6 South Indian Festivals'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {festivalList.map((fest) => {
          const isSelected = fest.id === selectedFestival;
          return (
            <button
              key={fest.id}
              onClick={() => onSelectFestival(fest.id)}
              className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-200 min-h-[96px] flex flex-col justify-end p-3 ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                  : 'border-stone-200 hover:border-amber-300 bg-stone-100/70 hover:bg-stone-100 shadow-xs'
              }`}
            >
              {/* Thumbnail Background */}
              <img
                src={fest.image}
                alt={fest.nameEn}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Scrim for contrast */}
              <div
                className={`absolute inset-0 transition-opacity ${
                  isSelected
                    ? 'bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-black/30'
                    : 'bg-gradient-to-t from-stone-950/85 via-stone-950/45 to-transparent group-hover:from-stone-950/90'
                }`}
              />

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Text info */}
              <div className="relative z-10">
                <span className="block text-xs font-semibold text-amber-300 leading-tight">
                  {fest.symbol}
                </span>
                <p className="font-bold text-white text-sm leading-snug mt-0.5 truncate">
                  {language === 'te' ? fest.nameTe : fest.nameEn}
                </p>
                <p className="text-[11px] text-amber-200/80 truncate">
                  {language === 'te' ? fest.nameEn : fest.nameTe}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
