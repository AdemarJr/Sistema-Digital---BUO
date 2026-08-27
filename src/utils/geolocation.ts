export interface EnderecoGeo {
  local: string;
  bairro: string;
  municipio: string;
  latitude: number;
  longitude: number;
}

function buildLocal(parts: {
  road?: string;
  houseNumber?: string;
  suburb?: string;
  city?: string;
}): string {
  const street = [parts.road, parts.houseNumber].filter(Boolean).join(', ');
  const rest = [parts.suburb, parts.city].filter(Boolean).join(' — ');
  return [street, rest].filter(Boolean).join(' — ') || '';
}

/** Reverse geocode via BigDataCloud (CORS-friendly, no API key). */
async function reverseGeocode(lat: number, lon: number): Promise<EnderecoGeo> {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client` +
    `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
    `&localityLanguage=pt`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao obter endereço');

  const data = (await res.json()) as {
    locality?: string;
    city?: string;
    principalSubdivision?: string;
    localityInfo?: {
      administrative?: Array<{ name?: string; description?: string; order?: number }>;
    };
    latitude?: number;
    longitude?: number;
  };

  const admin = data.localityInfo?.administrative ?? [];
  const roadLike = admin.find((a) =>
    /road|street|rua|avenida|av\.|travessa/i.test(`${a.description ?? ''} ${a.name ?? ''}`),
  );

  const municipio =
    data.city ||
    admin.find((a) => /municip|city|cidade/i.test(a.description ?? ''))?.name ||
    data.locality ||
    '';

  const bairro =
    data.locality && data.locality !== municipio
      ? data.locality
      : admin.find((a) => /bairro|suburb|neighbourhood|neighborhood/i.test(a.description ?? ''))
          ?.name || '';

  const local = buildLocal({
    road: roadLike?.name,
    suburb: bairro,
    city: municipio,
  }) || [bairro, municipio, data.principalSubdivision].filter(Boolean).join(' — ');

  return {
    local: local || `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
    bairro: bairro || '',
    municipio: municipio || '',
    latitude: lat,
    longitude: lon,
  };
}

export function getCurrentEndereco(): Promise<EnderecoGeo> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não disponível neste dispositivo'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const endereco = await reverseGeocode(latitude, longitude);
          resolve(endereco);
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Não foi possível obter o endereço'));
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Permissão de localização negada. Ative nas configurações do navegador.'));
        } else if (err.code === err.TIMEOUT) {
          reject(new Error('Tempo esgotado ao obter localização. Tente novamente.'));
        } else {
          reject(new Error('Não foi possível obter a localização.'));
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  });
}
