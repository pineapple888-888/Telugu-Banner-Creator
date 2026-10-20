import React, { useEffect, useRef, useState } from 'react';
import { BannerState, FestivalConfig } from '../types';
import { renderBannerToCanvas, getCanvasDimensions } from '../utils/canvasRenderer';
import { downloadCanvasAsImage, shareBannerToWhatsApp } from '../utils/shareUtils';
import { Download, Share2, Copy, Check, Sparkles, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

interface BannerCanvasPreviewProps {
  bannerState: BannerState;
  festival: FestivalConfig;
  language: 'te' | 'en';
  onOpenAiWish: () => void;
  onSetAspectRatio: (ratio: BannerState['aspectRatio']) => void;
}

export const BannerCanvasPreview: React.FC<BannerCanvasPreviewProps> = ({
  bannerState,
  festival,
  language,
  onOpenAiWish,
  onSetAspectRatio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState<number>(1);

  // Cached image elements
  const artImgRef = useRef<HTMLImageElement | null>(null);
  const userImgRef = useRef<HTMLImageElement | null>(null);

  // Load festival artwork
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = festival.image;
    img.onload = () => {
      artImgRef.current = img;
      triggerRender();
    };
  }, [festival.image]);

  // Load user uploaded photo if any
  useEffect(() => {
    if (bannerState.photoUrl) {
      const userImg = new Image();
      userImg.crossOrigin = 'anonymous';
      userImg.src = bannerState.photoUrl;
      userImg.onload = () => {
        userImgRef.current = userImg;
        triggerRender();
      };
    } else {
      userImgRef.current = null;
      triggerRender();
    }
  }, [bannerState.photoUrl]);

  // Re-render when state changes
  const triggerRender = async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);

    try {
      // Ensure fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }
      await renderBannerToCanvas({
        canvas: canvasRef.current,
        bannerState,
        festival,
        artImageElement: artImgRef.current,
        userPhotoImageElement: userImgRef.current,
      });
    } catch (err) {
      console.error('Error rendering banner:', err);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    triggerRender();
  }, [
    bannerState.festivalId,
    bannerState.aspectRatio,
    bannerState.language,
    bannerState.title,
    bannerState.message,
    bannerState.subtext,
    bannerState.senderName,
    bannerState.senderTitle,
    bannerState.fontFamily,
    bannerState.showBorders,
    bannerState.showToran,
    bannerState.showMuggu,
    bannerState.showDiyas,
  ]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const filename = `${festival.id}-${bannerState.aspectRatio.replace(':', 'x')}-banner.png`;
      await downloadCanvasAsImage(canvasRef.current, filename);
    } catch (err) {
      console.error('Download error:', err);
      alert(language === 'te' ? 'డౌన్‌లోడ్ చేయడంలో సమస్య ఏర్పడింది.' : 'Failed to download banner.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (!canvasRef.current) return;
    setIsSharing(true);
    setShareFeedback(null);
    try {
      const festName = language === 'te' ? festival.nameTe : festival.nameEn;
      const result = await shareBannerToWhatsApp(
        canvasRef.current,
        festName,
        bannerState.message || festival.defaultMessageTe,
        bannerState.senderName
      );
      if (result.message) {
        setShareFeedback(result.message);
        setTimeout(() => setShareFeedback(null), 5000);
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyText = () => {
    const fullText = `${bannerState.title}\n\n${bannerState.message}\n\n${bannerState.subtext}\n\n${
      bannerState.senderName ? `ఇట్లు: ${bannerState.senderName}` : ''
    }`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const { width: bannerWidth, height: bannerHeight } = getCanvasDimensions(bannerState.aspectRatio);

  return (
    <div className="flex flex-col bg-stone-900 rounded-2xl border border-stone-800 shadow-xl overflow-hidden">
      {/* Top Bar for Preview Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-stone-950/80 border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-400">
            {language === 'te' ? 'ప్రత్యక్ష పరిదృశ్యం' : 'Live Preview'}
          </span>
          <span className="text-stone-500 text-xs">·</span>
          <span className="text-stone-400 text-xs font-mono tabular-nums">
            {bannerWidth} × {bannerHeight}px
          </span>
        </div>

        {/* Aspect Ratio Selector Controls */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => onSetAspectRatio('1:1')}
            className={`min-h-[32px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              bannerState.aspectRatio === '1:1'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Square (Instagram Post / WhatsApp DP)"
          >
            1:1 {language === 'te' ? 'చతురస్రం' : 'Square'}
          </button>
          <button
            onClick={() => onSetAspectRatio('9:16')}
            className={`min-h-[32px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              bannerState.aspectRatio === '9:16'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Portrait (WhatsApp Status / Insta Story)"
          >
            9:16 {language === 'te' ? 'స్టేటస్' : 'Story'}
          </button>
          <button
            onClick={() => onSetAspectRatio('16:9')}
            className={`min-h-[32px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              bannerState.aspectRatio === '16:9'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Landscape (Greeting Card / Facebook Cover)"
          >
            16:9 {language === 'te' ? 'కార్డు' : 'Card'}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Container */}
      <div className="relative flex items-center justify-center p-4 sm:p-6 bg-stone-950 min-h-[360px] sm:min-h-[440px] overflow-auto">
        {/* Subtle traditional grid texture background behind canvas */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Loading Spinner */}
        {isRendering && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-amber-300 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{language === 'te' ? 'రూపొందిస్తోంది...' : 'Rendering Banner...'}</span>
            </div>
          </div>
        )}

        {/* The Actual HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="shadow-2xl rounded-lg max-h-[520px] w-auto max-w-full object-contain border border-stone-800 transition-transform"
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Share Feedback Toast */}
      {shareFeedback && (
        <div className="px-4 py-2 bg-emerald-950/90 border-t border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* Bottom Action Buttons (Download & WhatsApp Share) */}
      <div className="p-4 bg-stone-950 border-t border-stone-800/80 flex flex-col sm:flex-row items-center gap-3">
        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          disabled={isSharing || isRendering}
          className="w-full sm:flex-1 min-h-[48px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          <span className="whitespace-nowrap">
            {language === 'te' ? 'వాట్సాప్‌లో షేర్ చేయండి' : 'Share to WhatsApp'}
          </span>
        </button>

        {/* High Res Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading || isRendering}
          className="w-full sm:flex-1 min-h-[48px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="whitespace-nowrap">
            {language === 'te' ? 'HD బ్యానర్ డౌన్‌లోడ్' : 'Download HD Banner'}
          </span>
        </button>

        {/* Secondary: Copy Greeting Text */}
        <button
          onClick={handleCopyText}
          className="min-h-[48px] px-3.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60 transition-colors flex items-center justify-center gap-1.5 text-xs whitespace-nowrap shrink-0"
          title={language === 'te' ? 'శుభాకాంక్షల టెక్స్ట్ కాపీ చేయండి' : 'Copy Greeting Text'}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span className="hidden md:inline">{copied ? (language === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (language === 'te' ? 'కాపీ' : 'Copy')}</span>
        </button>
      </div>
    </div>
  );
};
