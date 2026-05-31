import { beforeEach, describe, expect, it } from 'vitest';

import {
  MenuPosition,
  MenuStyle,
  NetworkPage,
  TextSize,
  Theme,
  TimeFormat,
} from '../../src/type.settings';
import { SettingsUtil } from '../../src/util.settings';

beforeEach(() => localStorage.clear());

describe('SettingsUtil — defaults', () => {
  it('getTheme returns SYSTEM when nothing stored', () => {
    expect(SettingsUtil.getTheme()).toBe(Theme.SYSTEM);
  });

  it('getTimeFormat returns TWENTY_FOUR_HOUR when nothing stored', () => {
    expect(SettingsUtil.getTimeFormat()).toBe(TimeFormat.TWENTY_FOUR_HOUR);
  });

  it('getMenuPosition returns TOP when nothing stored', () => {
    expect(SettingsUtil.getMenuPosition()).toBe(MenuPosition.TOP);
  });

  it('getMenuStyle returns BOTH when nothing stored', () => {
    expect(SettingsUtil.getMenuStyle()).toBe(MenuStyle.BOTH);
  });

  it('getTextSize returns MEDIUM when nothing stored', () => {
    expect(SettingsUtil.getTextSize()).toBe(TextSize.MEDIUM);
  });

  it('getNetworkUsage returns empty object when nothing stored', () => {
    expect(SettingsUtil.getNetworkUsage()).toEqual({});
  });
});

describe('SettingsUtil — roundtrips', () => {
  it('setTheme / getTheme', () => {
    SettingsUtil.setTheme(Theme.DARK);
    expect(SettingsUtil.getTheme()).toBe(Theme.DARK);
  });

  it('setTimeFormat / getTimeFormat', () => {
    SettingsUtil.setTimeFormat(TimeFormat.TWELVE_HOUR);
    expect(SettingsUtil.getTimeFormat()).toBe(TimeFormat.TWELVE_HOUR);
  });

  it('setMenuPosition / getMenuPosition', () => {
    SettingsUtil.setMenuPosition(MenuPosition.BOTTOM);
    expect(SettingsUtil.getMenuPosition()).toBe(MenuPosition.BOTTOM);
  });

  it('setMenuStyle / getMenuStyle', () => {
    SettingsUtil.setMenuStyle(MenuStyle.ICON_ONLY);
    expect(SettingsUtil.getMenuStyle()).toBe(MenuStyle.ICON_ONLY);
  });

  it('setTextSize / getTextSize', () => {
    SettingsUtil.setTextSize(TextSize.LARGE);
    expect(SettingsUtil.getTextSize()).toBe(TextSize.LARGE);
  });
});

describe('SettingsUtil — resetAll', () => {
  it('clears all settings back to defaults', () => {
    SettingsUtil.setTheme(Theme.DARK);
    SettingsUtil.setTimeFormat(TimeFormat.TWELVE_HOUR);
    SettingsUtil.setMenuPosition(MenuPosition.BOTTOM);
    SettingsUtil.resetAll();
    expect(SettingsUtil.getTheme()).toBe(Theme.SYSTEM);
    expect(SettingsUtil.getTimeFormat()).toBe(TimeFormat.TWENTY_FOUR_HOUR);
    expect(SettingsUtil.getMenuPosition()).toBe(MenuPosition.TOP);
  });
});

describe('SettingsUtil — network usage', () => {
  it('addNetworkBytes accumulates bytes per page', () => {
    SettingsUtil.addNetworkBytes(NetworkPage.NEWS, 1000);
    SettingsUtil.addNetworkBytes(NetworkPage.NEWS, 500);
    expect(SettingsUtil.getNetworkUsage()[NetworkPage.NEWS]).toBe(1500);
  });

  it('addNetworkBytes tracks different pages independently', () => {
    SettingsUtil.addNetworkBytes(NetworkPage.NEWS, 1000);
    SettingsUtil.addNetworkBytes(NetworkPage.SEARCH, 200);
    const usage = SettingsUtil.getNetworkUsage();
    expect(usage[NetworkPage.NEWS]).toBe(1000);
    expect(usage[NetworkPage.SEARCH]).toBe(200);
  });

  it('addNetworkBytes records a log entry', () => {
    SettingsUtil.addNetworkBytes(NetworkPage.NEWS, 1000);
    const log = SettingsUtil.getNetworkLog();
    expect(log).toHaveLength(1);
    expect(log[0]).toMatchObject({ bytes: 1000, page: NetworkPage.NEWS });
  });

  it('resetNetworkUsage clears usage, log, and since timestamp', () => {
    SettingsUtil.addNetworkBytes(NetworkPage.NEWS, 1000);
    SettingsUtil.resetNetworkUsage();
    expect(SettingsUtil.getNetworkUsage()).toEqual({});
    expect(SettingsUtil.getNetworkLog()).toEqual([]);
    expect(SettingsUtil.getNetworkSince()).toBeNull();
  });
});

describe('SettingsUtil.convertHoursString', () => {
  it('returns raw string unchanged in 12h format', () => {
    const raw = 'Monday: 9:00 AM – 6:00 PM';
    expect(SettingsUtil.convertHoursString(raw, TimeFormat.TWELVE_HOUR)).toBe(raw);
  });

  it('converts AM/PM to 24h in 24h format', () => {
    expect(SettingsUtil.convertHoursString('9:00 AM – 6:00 PM', TimeFormat.TWENTY_FOUR_HOUR)).toBe(
      '09:00 – 18:00',
    );
  });

  it('treats 12:xx PM as noon (stays 12)', () => {
    expect(SettingsUtil.convertHoursString('12:00 PM', TimeFormat.TWENTY_FOUR_HOUR)).toBe('12:00');
  });

  it('treats 12:xx AM as midnight (becomes 00)', () => {
    expect(SettingsUtil.convertHoursString('12:00 AM', TimeFormat.TWENTY_FOUR_HOUR)).toBe('00:00');
  });
});
