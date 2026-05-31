import { describe, expect, it } from 'vitest';

import type { TransitLeg } from '@slim-portal/share';
import { TransitUtil } from '../../src/util.transit';

const makeLeg = (line: string): TransitLeg => ({
  arrive: null,
  color: null,
  depart: null,
  distance: null,
  duration: null,
  from: 'A',
  getoff: null,
  line,
  platform: '',
  to: 'B',
});

describe('TransitUtil', () => {
  describe('isWalkLeg', () => {
    it('returns true for "walk"', () => {
      expect(TransitUtil.isWalkLeg(makeLeg('walk'))).toBe(true);
    });

    it('returns true for "徒歩"', () => {
      expect(TransitUtil.isWalkLeg(makeLeg('徒歩'))).toBe(true);
    });

    it('returns true for "walking"', () => {
      expect(TransitUtil.isWalkLeg(makeLeg('walking'))).toBe(true);
    });

    it('returns false for a train line name', () => {
      expect(TransitUtil.isWalkLeg(makeLeg('JR山手線'))).toBe(false);
    });

    it('is case-insensitive for ASCII', () => {
      expect(TransitUtil.isWalkLeg(makeLeg('WALK'))).toBe(true);
      expect(TransitUtil.isWalkLeg(makeLeg('Walking'))).toBe(true);
    });
  });
});
