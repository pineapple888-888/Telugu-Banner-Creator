import { BannerState, FestivalConfig } from '../types';

interface DrawOptions {
  canvas: HTMLCanvasElement;
  bannerState: BannerState;
  festival: FestivalConfig;
  artImageElement?: HTMLImageElement | null;
  userPhotoImageElement?: HTMLImageElement | null;
}

export function getCanvasDimensions(ratio: BannerState['aspectRatio']): { width: number; height: number } {
  switch (ratio) {
    case '9:16':
      return { width: 1080, height: 1920 };
    case '16:9':
      return { width: 1920, height: 1080 };
    case '1:1':
    default:
      return { width: 1080, height: 1080 };
  }
}

// Helper to wrap text into lines fitting max width
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Draw traditional marigold & mango leaf toranam at top
function drawToranam(ctx: CanvasRenderingContext2D, width: number) {
  ctx.save();
  const garlandCount = Math.max(7, Math.floor(width / 130));
  const span = width / garlandCount;

  // Main golden string
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(width, 18);
  ctx.stroke();

  // Draw scallops and leaves
  for (let i = 0; i < garlandCount; i++) {
    const startX = i * span;
    const midX = startX + span / 2;
    const endX = startX + span;
    const dipY = 64;

    // Scalloped curve
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, 18);
    ctx.quadraticCurveTo(midX, dipY, endX, 18);
    ctx.stroke();

    // Marigold flower beads along curve
    const steps = 6;
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const bx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
      const by = (1 - t) * (1 - t) * 18 + 2 * (1 - t) * t * dipY + t * t * 18;

      ctx.fillStyle = s % 2 === 0 ? '#F97316' : '#FBBF24';
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();

      // Flower center
      ctx.fillStyle = '#7C2D12';
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mango leaf hanging from center
    ctx.save();
    ctx.translate(midX, dipY - 8);
    ctx.fillStyle = '#15803D';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-14, 25, 0, 52);
    ctx.quadraticCurveTo(14, 25, 0, 0);
    ctx.fill();

    // Leaf center vein
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(0, 48);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// Draw traditional South Indian Rice Muggu / Rangoli pattern
function drawMuggu(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.45)';
  ctx.lineWidth = 2.5;

  const petals = 8;
  for (let i = 0; i < petals; i++) {
    ctx.rotate((Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.35, -size * 0.25, size * 0.7, 0);
    ctx.quadraticCurveTo(size * 0.35, size * 0.25, 0, 0);
    ctx.stroke();

    // Outer decorative dots
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(size * 0.85, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner circle
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Draw Ornate South Indian Brass Diya (ప్రమిద / కుందు)
function drawDiya(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Flame glow
  const glow = ctx.createRadialGradient(0, -32, 2, 0, -32, 40);
  glow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  glow.addColorStop(0.4, 'rgba(245, 158, 11, 0.75)');
  glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -32, 40, 0, Math.PI * 2);
  ctx.fill();

  // Flame teardrop
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.moveTo(0, -48);
  ctx.quadraticCurveTo(12, -32, 6, -18);
  ctx.quadraticCurveTo(0, -14, -6, -18);
  ctx.quadraticCurveTo(-12, -32, 0, -48);
  ctx.fill();

  // Inner flame core
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(0, -38);
  ctx.quadraticCurveTo(5, -28, 3, -19);
  ctx.quadraticCurveTo(0, -17, -3, -19);
  ctx.quadraticCurveTo(-5, -28, 0, -38);
  ctx.fill();

  // Brass Bowl (కుంది)
  const brass = ctx.createLinearGradient(-35, 0, 35, 20);
  brass.addColorStop(0, '#D97706');
  brass.addColorStop(0.5, '#FDE68A');
  brass.addColorStop(1, '#92400E');

  ctx.fillStyle = brass;
  ctx.beginPath();
  ctx.moveTo(-35, -15);
  ctx.quadraticCurveTo(0, -10, 35, -15);
  ctx.quadraticCurveTo(28, 14, 12, 16);
  ctx.lineTo(8, 26);
  ctx.lineTo(-8, 26);
  ctx.lineTo(-12, 16);
  ctx.quadraticCurveTo(-28, 14, -35, -15);
  ctx.fill();

  // Diya base pedestal
  ctx.beginPath();
  ctx.ellipse(0, 27, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Ornate Traditional Golden Border
function drawOrnateBorder(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const margin = 26;

  // Outer gold line
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner delicate hairline
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2);

  // Corner floral ornaments
  const corners = [
    { x: margin, y: margin },
    { x: width - margin, y: margin },
    { x: margin, y: height - margin },
    { x: width - margin, y: height - margin },
  ];

  for (const c of corners) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Corner filigree dots
    ctx.fillStyle = '#FEF08A';
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      const dx = Math.cos(angle) * 16;
      const dy = Math.sin(angle) * 16;
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

export async function renderBannerToCanvas({
  canvas,
  bannerState,
  festival,
  artImageElement,
  userPhotoImageElement,
}: DrawOptions): Promise<void> {
  const { width, height } = getCanvasDimensions(bannerState.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // 1. Festive Auspicious Gradient Background
  const bgGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.35,
    50,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.8
  );

  bgGrad.addColorStop(0, festival.gradient[1]);
  bgGrad.addColorStop(0.65, festival.gradient[0]);
  bgGrad.addColorStop(1, '#0C0A09'); // Rich deep velvet finish
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Auspicious South Indian Motif Texture / Watermark
  if (bannerState.showMuggu) {
    drawMuggu(ctx, width * 0.12, height * 0.88, 80);
    drawMuggu(ctx, width * 0.88, height * 0.88, 80);
    drawMuggu(ctx, width * 0.5, height * 0.5, 120);
  }

  // 3. Render Festival Visual Artwork
  // We adapt the layout depending on Aspect Ratio:
  // - 1:1: Upper center framed arch/card with artwork (or integrated festive portal)
  // - 9:16: Upper large ornate temple arch with artwork, lower expansive typography & blessings
  // - 16:9: Split layout (Left half framed temple arch with artwork, right half greeting text & sender)
  const isLandscape = bannerState.aspectRatio === '16:9';
  const isPortrait = bannerState.aspectRatio === '9:16';

  let artRect = { x: 0, y: 0, w: 0, h: 0 };
  let textZone = { x: 0, y: 0, w: 0, h: 0 };

  if (isLandscape) {
    artRect = {
      x: 70,
      y: 90,
      w: width * 0.42,
      h: height - 180,
    };
    textZone = {
      x: width * 0.48,
      y: 110,
      w: width * 0.47,
      h: height - 200,
    };
  } else if (isPortrait) {
    const artH = height * 0.40;
    artRect = {
      x: 70,
      y: 120,
      w: width - 140,
      h: artH,
    };
    textZone = {
      x: 70,
      y: artRect.y + artRect.h + 50,
      w: width - 140,
      h: height - (artRect.y + artRect.h + 100),
    };
  } else {
    // 1:1 Square
    const artH = height * 0.44;
    artRect = {
      x: 80,
      y: 100,
      w: width - 160,
      h: artH,
    };
    textZone = {
      x: 70,
      y: artRect.y + artRect.h + 35,
      w: width - 140,
      h: height - (artRect.y + artRect.h + 70),
    };
  }

  // Draw Festival Art in Temple Arch Frame
  if (artImageElement && artImageElement.complete && artImageElement.naturalWidth > 0) {
    ctx.save();
    // Rounded arch clipping path
    const cornerR = 24;
    ctx.beginPath();
    ctx.roundRect(artRect.x, artRect.y, artRect.w, artRect.h, [cornerR, cornerR, cornerR, cornerR]);
    ctx.clip();

    // Draw image maintaining cover aspect ratio
    const imgAspect = artImageElement.naturalWidth / artImageElement.naturalHeight;
    const boxAspect = artRect.w / artRect.h;
    let sW, sH, sX, sY;

    if (imgAspect > boxAspect) {
      sH = artImageElement.naturalHeight;
      sW = sH * boxAspect;
      sX = (artImageElement.naturalWidth - sW) / 2;
      sY = 0;
    } else {
      sW = artImageElement.naturalWidth;
      sH = sW / boxAspect;
      sX = 0;
      sY = (artImageElement.naturalHeight - sH) / 2;
    }

    ctx.drawImage(artImageElement, sX, sY, sW, sH, artRect.x, artRect.y, artRect.w, artRect.h);

    // Warm golden vignette overlay at bottom of image
    const artGrad = ctx.createLinearGradient(0, artRect.y + artRect.h * 0.5, 0, artRect.y + artRect.h);
    artGrad.addColorStop(0, 'rgba(0,0,0,0)');
    artGrad.addColorStop(1, 'rgba(15, 10, 5, 0.6)');
    ctx.fillStyle = artGrad;
    ctx.fillRect(artRect.x, artRect.y, artRect.w, artRect.h);

    ctx.restore();

    // Ornate Golden Arch Border around the Art
    ctx.save();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(artRect.x, artRect.y, artRect.w, artRect.h, [cornerR, cornerR, cornerR, cornerR]);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(artRect.x + 6, artRect.y + 6, artRect.w - 12, artRect.h - 12, [cornerR - 4, cornerR - 4, cornerR - 4, cornerR - 4]);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Draw Traditional Toranam
  if (bannerState.showToran) {
    drawToranam(ctx, width);
  }

  // 5. Draw Diya Lamps on corners/sides
  if (bannerState.showDiyas) {
    if (isLandscape) {
      drawDiya(ctx, artRect.x + 35, artRect.y + artRect.h - 15, 0.85);
      drawDiya(ctx, artRect.x + artRect.w - 35, artRect.y + artRect.h - 15, 0.85);
    } else {
      drawDiya(ctx, 80, height - 90, 1.0);
      drawDiya(ctx, width - 80, height - 90, 1.0);
    }
  }

  // 6. Draw Ornate South Indian Gold Border
  if (bannerState.showBorders) {
    drawOrnateBorder(ctx, width, height);
  }

  // 7. Typography: Sacred Header ("|| శ్రీరస్తు · శుభమస్తు ||")
  ctx.save();
  const fontFam = bannerState.fontFamily || 'Noto Sans Telugu';
  ctx.textAlign = isLandscape ? 'left' : 'center';
  const textCenterX = isLandscape ? textZone.x : width / 2;

  // Auspicious Header Kicker
  ctx.fillStyle = '#F59E0B';
  ctx.font = `600 ${isPortrait ? 24 : 20}px "${fontFam}", sans-serif`;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  const auspiciousKicker = bannerState.language === 'te' ? '॥ శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు ॥' : '॥ Om Sri Gurubhyo Namaha ॥';
  let curY = textZone.y + (isPortrait ? 25 : 15);
  ctx.fillText(auspiciousKicker, textCenterX, curY);

  // Main Festival Title (e.g. "శ్రీ క్రోధినామ నూతన సంవత్సర ఉగాది శుభాకాంక్షలు")
  curY += isPortrait ? 55 : 48;
  const titleFontSize = isLandscape ? 40 : isPortrait ? 44 : 36;
  ctx.font = `bold ${titleFontSize}px "${fontFam}", "Ramabhadra", sans-serif`;

  // Golden Title Gradient
  const titleGrad = ctx.createLinearGradient(
    textCenterX - 200,
    curY - 30,
    textCenterX + 200,
    curY + 20
  );
  titleGrad.addColorStop(0, '#FEF08A');
  titleGrad.addColorStop(0.5, '#FBBF24');
  titleGrad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = titleGrad;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  const titleLines = wrapText(ctx, bannerState.title || festival.defaultTitleTe, textZone.w);
  for (const tLine of titleLines) {
    ctx.fillText(tLine, textCenterX, curY);
    curY += titleFontSize * 1.25;
  }

  // Golden Divider Line under Title
  curY += 8;
  ctx.save();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (isLandscape) {
    ctx.moveTo(textZone.x, curY);
    ctx.lineTo(textZone.x + Math.min(320, textZone.w), curY);
  } else {
    ctx.moveTo(width / 2 - 160, curY);
    ctx.lineTo(width / 2 + 160, curY);
  }
  ctx.stroke();

  // Small flower bead in divider center
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  const divCenterX = isLandscape ? textZone.x + 160 : width / 2;
  ctx.arc(divCenterX, curY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Main Festive Greeting / Message Body
  curY += isPortrait ? 42 : 32;
  const msgFontSize = isLandscape ? 26 : isPortrait ? 28 : 23;
  ctx.font = `500 ${msgFontSize}px "${fontFam}", sans-serif`;
  ctx.fillStyle = '#FFFBEB';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  const messageLines = wrapText(ctx, bannerState.message || festival.defaultMessageTe, textZone.w);
  for (const mLine of messageLines) {
    ctx.fillText(mLine, textCenterX, curY);
    curY += msgFontSize * 1.45;
  }

  // Auspicious Subtext / Blessing Line
  if (bannerState.subtext) {
    curY += isPortrait ? 26 : 18;
    const subFontSize = isLandscape ? 21 : isPortrait ? 23 : 19;
    ctx.font = `600 ${subFontSize}px "${fontFam}", sans-serif`;
    ctx.fillStyle = '#FDE68A';
    const subLines = wrapText(ctx, bannerState.subtext, textZone.w);
    for (const sLine of subLines) {
      ctx.fillText(sLine, textCenterX, curY);
      curY += subFontSize * 1.35;
    }
  }

  // 8. Sender Section with Optional User Photo
  // Positioned nicely at bottom
  const senderY = isLandscape ? height - 120 : height - (isPortrait ? 150 : 110);
  const hasUserPhoto = Boolean(userPhotoImageElement && userPhotoImageElement.complete && userPhotoImageElement.naturalWidth > 0);

  if (bannerState.senderName || hasUserPhoto) {
    const senderBoxH = 80;
    const senderCenterY = senderY;

    if (hasUserPhoto && userPhotoImageElement) {
      // Photo badge + Sender Name lockup
      const photoRadius = 38;
      const photoX = isLandscape ? textZone.x + photoRadius + 10 : width / 2 - 130;
      const textX = photoX + photoRadius + 22;

      // Draw Photo with Circular Gold Frame
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX, senderCenterY, photoRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        userPhotoImageElement,
        0,
        0,
        userPhotoImageElement.naturalWidth,
        userPhotoImageElement.naturalHeight,
        photoX - photoRadius,
        senderCenterY - photoRadius,
        photoRadius * 2,
        photoRadius * 2
      );
      ctx.restore();

      // Gold circle border around user photo
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(photoX, senderCenterY, photoRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Gold bead accents
      ctx.fillStyle = '#FEF08A';
      for (let b = 0; b < 12; b++) {
        const rad = (b * Math.PI) / 6;
        ctx.beginPath();
        ctx.arc(photoX + Math.cos(rad) * (photoRadius + 4), senderCenterY + Math.sin(rad) * (photoRadius + 4), 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Text next to photo
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#F59E0B';
      ctx.font = `600 17px "${fontFam}", sans-serif`;
      const fromLabel = bannerState.language === 'te' ? 'ఇట్లు: మీ శ్రేయోభిలాషి' : 'With Warm Greetings From:';
      ctx.fillText(fromLabel, textX, senderCenterY - 10);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 24px "${fontFam}", sans-serif`;
      ctx.fillText(bannerState.senderName || 'మీ పేరు / Family Name', textX, senderCenterY + 18);

      if (bannerState.senderTitle) {
        ctx.fillStyle = '#FDE68A';
        ctx.font = `500 16px "${fontFam}", sans-serif`;
        ctx.fillText(bannerState.senderTitle, textX, senderCenterY + 38);
      }
      ctx.restore();
    } else {
      // Centered Sender Name
      ctx.save();
      ctx.textAlign = isLandscape ? 'left' : 'center';
      const sX = isLandscape ? textZone.x : width / 2;

      ctx.fillStyle = '#F59E0B';
      ctx.font = `600 18px "${fontFam}", sans-serif`;
      const fromLabel = bannerState.language === 'te' ? 'ఇట్లు:' : 'With best compliments from:';
      ctx.fillText(fromLabel, sX, senderCenterY - 14);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 26px "${fontFam}", sans-serif`;
      ctx.fillText(bannerState.senderName || 'మీ పేరు / Family Name', sX, senderCenterY + 16);

      if (bannerState.senderTitle) {
        ctx.fillStyle = '#FDE68A';
        ctx.font = `500 17px "${fontFam}", sans-serif`;
        ctx.fillText(bannerState.senderTitle, sX, senderCenterY + 38);
      }
      ctx.restore();
    }
  }

  ctx.restore();
}
