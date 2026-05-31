import { describe, expect, it } from 'vitest';

import { RssLib } from '../src/lib/rss';

describe('RssLib', () => {
  describe('stripCdata', () => {
    it('strips CDATA wrapper', () => {
      expect(RssLib.stripCdata('<![CDATA[Hello World]]>')).toBe('Hello World');
    });

    it('trims whitespace inside CDATA', () => {
      expect(RssLib.stripCdata('<![CDATA[  spaces  ]]>')).toBe('spaces');
    });

    it('passes through plain strings unchanged', () => {
      expect(RssLib.stripCdata('plain text')).toBe('plain text');
    });

    it('returns empty string for empty CDATA', () => {
      expect(RssLib.stripCdata('<![CDATA[]]>')).toBe('');
    });
  });

  describe('extractTag', () => {
    it('extracts content of a named tag', () => {
      expect(RssLib.extractTag('<title>Hello</title>', 'title')).toBe('Hello');
    });

    it('unwraps CDATA content inside a tag', () => {
      expect(RssLib.extractTag('<title><![CDATA[World]]></title>', 'title')).toBe('World');
    });

    it('returns empty string when tag is absent', () => {
      expect(RssLib.extractTag('<item>no title here</item>', 'title')).toBe('');
    });

    it('trims surrounding whitespace', () => {
      expect(RssLib.extractTag('<title>  padded  </title>', 'title')).toBe('padded');
    });
  });

  describe('extractLinkUrl', () => {
    it('extracts URL from <link> tag', () => {
      expect(RssLib.extractLinkUrl('<link>https://example.com/</link>')).toBe(
        'https://example.com/',
      );
    });

    it('falls back to <guid> when it looks like a URL', () => {
      expect(
        RssLib.extractLinkUrl('<item><guid>https://example.com/article</guid></item>'),
      ).toBe('https://example.com/article');
    });

    it('returns empty string when guid is not a URL', () => {
      expect(RssLib.extractLinkUrl('<guid>some-opaque-id</guid>')).toBe('');
    });

    it('returns empty string when neither link nor guid exists', () => {
      expect(RssLib.extractLinkUrl('<item>no urls here</item>')).toBe('');
    });
  });

  describe('parseRssXml', () => {
    const makeItem = (title: string, link: string, pubDate: string, desc = ''): string =>
      `<item><title>${title}</title><link>${link}</link><pubDate>${pubDate}</pubDate><description>${desc}</description></item>`;

    it('parses items into NewsItem array', () => {
      const xml = makeItem('Test Title', 'https://example.com/1', '2024-06-01T00:00:00Z');
      const items = RssLib.parseRssXml(`<rss>${xml}</rss>`, 'TestSource');
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        publishedAt: '2024-06-01T00:00:00Z',
        source: 'TestSource',
        title: 'Test Title',
        url: 'https://example.com/1',
      });
    });

    it('limits output to 15 items', () => {
      const xml = Array.from({ length: 20 }, (_, i) =>
        makeItem(`Title ${i}`, `https://example.com/${i}`, '2024-06-01T00:00:00Z'),
      ).join('');
      const items = RssLib.parseRssXml(`<rss>${xml}</rss>`, 'TestSource');
      expect(items.length).toBeLessThanOrEqual(15);
    });

    it('filters out items with no title', () => {
      const xml = `<item><title></title><link>https://example.com/</link><pubDate>2024-06-01</pubDate></item>`;
      expect(RssLib.parseRssXml(`<rss>${xml}</rss>`, 'S')).toHaveLength(0);
    });

    it('filters out items with no URL', () => {
      const xml = `<item><title>Title</title><pubDate>2024-06-01</pubDate></item>`;
      expect(RssLib.parseRssXml(`<rss>${xml}</rss>`, 'S')).toHaveLength(0);
    });

    it('handles CDATA-wrapped title', () => {
      const xml = `<item><title><![CDATA[CDATA Title]]></title><link>https://example.com/</link><pubDate>2024-06-01</pubDate></item>`;
      const items = RssLib.parseRssXml(`<rss>${xml}</rss>`, 'S');
      expect(items[0]?.title).toBe('CDATA Title');
    });

    it('strips HTML tags from description for summary', () => {
      const xml = makeItem('T', 'https://example.com/', '2024-06-01', '<p>Hello <b>world</b></p>');
      const items = RssLib.parseRssXml(`<rss>${xml}</rss>`, 'S');
      expect(items[0]?.summary).toBe('Hello world');
    });

    it('returns empty array for XML with no <item> blocks', () => {
      expect(RssLib.parseRssXml('<rss><channel></channel></rss>', 'S')).toHaveLength(0);
    });
  });
});
