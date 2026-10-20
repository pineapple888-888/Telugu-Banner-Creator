/**
 * Utility functions for downloading and sharing festival banners to WhatsApp and other platforms
 */

export function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string = 'telugu-festival-banner.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve();
      }, 'image/png', 0.98);
    } catch (err) {
      reject(err);
    }
  });
}

export interface ShareResult {
  sharedViaWebShare: boolean;
  message: string;
}

export async function shareBannerToWhatsApp(
  canvas: HTMLCanvasElement,
  festivalName: string,
  greetingMessage: string,
  senderName: string
): Promise<ShareResult> {
  const shareText = `🪔 *${festivalName} శుభాకాంక్షలు!*\n\n${greetingMessage}\n\n${senderName ? `_ఇట్లు: ${senderName}_\n\n` : ''}✨ Created with Telugu Festival Banner Creator ✨`;

  // 1. Check if navigator.canShare supports sharing image files directly
  if (navigator.share && navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png', 0.98)
      );

      if (blob) {
        const file = new File([blob], `${festivalName.toLowerCase().replace(/\s+/g, '-')}-banner.png`, {
          type: 'image/png',
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${festivalName} శుభాకాంక్షలు`,
            text: shareText,
            files: [file],
          });
          return {
            sharedViaWebShare: true,
            message: 'Shared successfully with image!',
          };
        }
      }
    } catch (err: any) {
      // User cancelled share dialog or permission denied
      if (err.name === 'AbortError') {
        return {
          sharedViaWebShare: false,
          message: 'Share cancelled',
        };
      }
      console.warn('Native file share failed, falling back to WhatsApp Web/App link', err);
    }
  }

  // 2. Fallback: Automatically download the image for the user and open WhatsApp with prefilled message
  try {
    await downloadCanvasAsImage(canvas, `${festivalName.toLowerCase().replace(/\s+/g, '-')}-banner.png`);
  } catch (e) {
    console.error('Auto download fallback failed', e);
  }

  const encodedText = encodeURIComponent(shareText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

  // Open WhatsApp in new window/tab
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  return {
    sharedViaWebShare: false,
    message: 'Banner image downloaded! WhatsApp opened with your festive message.',
  };
}
