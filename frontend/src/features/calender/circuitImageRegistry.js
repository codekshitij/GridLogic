import { normalizeKey } from "./calendarUtils";

const CIRCUIT_IMAGE_MAP = {
  "australian grand prix": "/circuits/Australia.png",
  "chinese grand prix": "/circuits/Chaina.png",
  "japanese grand prix": "/circuits/Japan.png",
  "miami grand prix": "/circuits/Maimi.png",
  "italian grand prix": "/circuits/Monza.png",
  "canadian grand prix": "/circuits/canada.png",
};

export const getCircuitImageUrl = (eventName) => {
  const key = normalizeKey(eventName);
  if (!key) return null;
  return CIRCUIT_IMAGE_MAP[key] || null;
};

export const getCircuitImageMap = () => CIRCUIT_IMAGE_MAP;
