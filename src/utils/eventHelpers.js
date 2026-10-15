export const getBestImage = (images = []) => {
  const wide = images.filter((img) => img.ratio === '16_9' && img.width >= 640);
  if (wide.length > 0) {
    return wide.sort((a, b) => a.width - b.width)[0].url;
  }
  return images[0]?.url || '';
};

export const formatEventDate = (event) => {
  const start = event?.dates?.start;
  if (!start?.localDate) return 'Date to be announced';
  const date = new Date(`${start.localDate}T${start.localTime || '00:00:00'}`);
  const day = date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  if (!start.localTime) return day;
  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
};

export const getVenue = (event) => event?._embedded?.venues?.[0];

export const getCategory = (event) => {
  const c = event?.classifications?.[0];
  return {
    segment: c?.segment?.name,
    genre: c?.genre?.name,
  };
};

export const getPriceRange = (event) => {
  const p = event?.priceRanges?.[0];
  if (!p) return 'Price not available';
  return `${p.currency} ${p.min} - ${p.max}`;
};

export const isUpcoming = (event) => {
  const start = event?.dates?.start;
  if (!start?.localDate) return true;
  const date = new Date(`${start.localDate}T${start.localTime || '23:59:59'}`);
  return date >= new Date();
};