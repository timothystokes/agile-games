import { parseHash, isValidGameId } from '../utils/router';

describe('isValidGameId', () => {
  it.each(['game-1', 'game-2', 'game-3', 'game-4', 'game-5'])(
    'returns true for %s',
    (id) => {
      expect(isValidGameId(id)).toBe(true);
    }
  );

  it('returns false for game-0', () => {
    expect(isValidGameId('game-0')).toBe(false);
  });

  it('returns false for game-6', () => {
    expect(isValidGameId('game-6')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidGameId('')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidGameId(null)).toBe(false);
  });
});

describe('parseHash', () => {
  it('returns a valid game id from a hash string', () => {
    expect(parseHash('#game-3')).toBe('game-3');
  });

  it('returns null for an empty hash', () => {
    expect(parseHash('')).toBeNull();
  });

  it('returns null for a bare # with no fragment', () => {
    expect(parseHash('#')).toBeNull();
  });

  it('returns null for an unknown fragment', () => {
    expect(parseHash('#settings')).toBeNull();
  });

  it('strips the leading # before validating', () => {
    expect(parseHash('#game-2')).toBe('game-2');
  });
});
