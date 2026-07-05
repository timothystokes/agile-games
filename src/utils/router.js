const VALID_IDS = new Set(['game-1', 'game-2', 'game-3', 'game-4', 'game-5']);

export const isValidGameId = (id) => Boolean(id) && VALID_IDS.has(id);

export const parseHash = (hash) => {
  const id = hash.replace(/^#/, '');
  return isValidGameId(id) ? id : null;
};
