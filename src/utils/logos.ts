/** Converte fundo preto (ou quase preto) em transparência para uso no PDF. */
export async function loadLogoWithoutBlackBg(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          // Fundo preto / quase preto → transparente
          if (r < 28 && g < 28 && b < 28) {
            d[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => reject(new Error(`Falha ao carregar logo: ${src}`));
    img.src = src;
  });
}

export async function getBuoLogos(): Promise<{ brasao: string; pmam: string }> {
  const base = import.meta.env.BASE_URL;
  const [brasao, pmam] = await Promise.all([
    loadLogoWithoutBlackBg(`${base}logos/brasao.png`),
    loadLogoWithoutBlackBg(`${base}logos/pmam-ft.png`),
  ]);
  return { brasao, pmam };
}
