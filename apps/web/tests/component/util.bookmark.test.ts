import { beforeEach, describe, expect, it } from 'vitest';

import { BookmarkPage, type Bookmark } from '../../src/type.bookmark';
import { BookmarkUtil } from '../../src/util.bookmark';

const makeBookmark = (id: string, page: BookmarkPage, params: Record<string, string>): Bookmark => ({
  createdAt: new Date().toISOString(),
  id,
  label: `Label ${id}`,
  page,
  params: params as Bookmark['params'],
});

const search1 = makeBookmark('s1', BookmarkPage.SEARCH, { q: 'weather' });
const search2 = makeBookmark('s2', BookmarkPage.SEARCH, { q: 'news' });
const transitBm = makeBookmark('t1', BookmarkPage.TRANSIT, {
  from: '35.68,139.77',
  from_name: 'Tokyo',
  to: '35.66,139.70',
  to_name: 'Shibuya',
});

beforeEach(() => localStorage.clear());

describe('BookmarkUtil — localStorage operations', () => {
  describe('getAll', () => {
    it('returns empty array when storage is empty', () => {
      expect(BookmarkUtil.getAll()).toEqual([]);
    });
  });

  describe('add', () => {
    it('stores a bookmark', () => {
      BookmarkUtil.add(search1);
      expect(BookmarkUtil.getAll()).toHaveLength(1);
    });

    it('prepends (newest first)', () => {
      BookmarkUtil.add(search1);
      BookmarkUtil.add(search2);
      expect(BookmarkUtil.getAll()[0]?.id).toBe('s2');
    });
  });

  describe('getById', () => {
    it('returns matching bookmark', () => {
      BookmarkUtil.add(search1);
      expect(BookmarkUtil.getById('s1')).toMatchObject({ id: 's1' });
    });

    it('returns null for unknown id', () => {
      expect(BookmarkUtil.getById('nonexistent')).toBeNull();
    });
  });

  describe('delete', () => {
    it('removes a bookmark by id', () => {
      BookmarkUtil.add(search1);
      BookmarkUtil.add(search2);
      BookmarkUtil.delete('s1');
      const all = BookmarkUtil.getAll();
      expect(all).toHaveLength(1);
      expect(all[0]?.id).toBe('s2');
    });
  });

  describe('deleteMany', () => {
    it('removes multiple bookmarks by ids', () => {
      BookmarkUtil.add(search1);
      BookmarkUtil.add(search2);
      BookmarkUtil.deleteMany(['s1', 's2']);
      expect(BookmarkUtil.getAll()).toHaveLength(0);
    });
  });

  describe('deleteAll', () => {
    it('clears all bookmarks', () => {
      BookmarkUtil.add(search1);
      BookmarkUtil.add(search2);
      BookmarkUtil.deleteAll();
      expect(BookmarkUtil.getAll()).toHaveLength(0);
    });
  });
});

describe('BookmarkUtil.buildUrl', () => {
  it('builds SEARCH URL', () => {
    expect(BookmarkUtil.buildUrl(search1)).toBe('/search?q=weather&restore=1');
  });

  it('builds TRANSIT URL with all params', () => {
    const url = BookmarkUtil.buildUrl(transitBm);
    expect(url).toContain('/transit?');
    expect(url).toContain('from_name=Tokyo');
    expect(url).toContain('to_name=Shibuya');
    expect(url).toContain('restore=1');
  });

  it('builds TRANSIT_ROUTE URL', () => {
    const bm = makeBookmark('tr1', BookmarkPage.TRANSIT_ROUTE, {});
    expect(BookmarkUtil.buildUrl(bm)).toBe('/transit/detail?id=tr1');
  });

  it('builds PLACE URL', () => {
    const bm = makeBookmark('p1', BookmarkPage.PLACE, { q: 'coffee' });
    expect(BookmarkUtil.buildUrl(bm)).toBe('/place?q=coffee&restore=1');
  });

  it('builds PLACE_DETAIL URL', () => {
    const bm = makeBookmark('pd1', BookmarkPage.PLACE_DETAIL, {});
    expect(BookmarkUtil.buildUrl(bm)).toBe('/place/detail?snapshot=pd1');
  });
});
