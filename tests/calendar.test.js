import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dateToJalali, formatJalali, isJalaliLeapYear,
  isValidJalaliDate, jalaliMonthLength, toEnglishDigits, toGregorian,
  toJalali, toPersianDigits,
} from '../shared/calendar.js';

test('Nowruz conversions match known Gregorian dates', () => {
  assert.deepEqual(toGregorian(1403, 1, 1), {gy: 2024, gm: 3, gd: 20});
  assert.deepEqual(toGregorian(1404, 1, 1), {gy: 2025, gm: 3, gd: 21});
  assert.deepEqual(toGregorian(1405, 1, 1), {gy: 2026, gm: 3, gd: 21});
  assert.deepEqual(toJalali(2024, 3, 20), {jy: 1403, jm: 1, jd: 1});
});

test('round trips Gregorian and Jalali boundary dates', () => {
  for (const [gy, gm, gd] of [[1900, 1, 1], [2000, 2, 29], [2024, 3, 19],
    [2024, 3, 20], [2025, 3, 20], [2026, 9, 4]]) {
    const j = toJalali(gy, gm, gd);
    assert.deepEqual(toGregorian(j.jy, j.jm, j.jd), {gy, gm, gd});
  }
});

test('Jalali leap years and Esfand limits are correct', () => {
  assert.equal(isJalaliLeapYear(1399), true);
  assert.equal(isJalaliLeapYear(1400), false);
  assert.equal(isJalaliLeapYear(1403), true);
  assert.equal(jalaliMonthLength(1403, 12), 30);
  assert.equal(jalaliMonthLength(1404, 12), 29);
  assert.equal(isValidJalaliDate(1403, 12, 30), true);
  assert.equal(isValidJalaliDate(1404, 12, 30), false);
});

test('invalid input is rejected', () => {
  assert.throws(() => toGregorian(1404, 13, 1), RangeError);
  assert.throws(() => toJalali(2023, 2, 29), RangeError);
});

test('digits convert in both directions', () => {
  assert.equal(toPersianDigits('1405/06/13'), '۱۴۰۵/۰۶/۱۳');
  assert.equal(toEnglishDigits('۱۴۰۵/۰۶/۱۳'), '1405/06/13');
});

test('formatting provides expected Persian output', () => {
  const date = new Date(2026, 8, 4, 12);
  assert.equal(dateToJalali(date).jy, 1405);
  assert.equal(formatJalali(date, 'numeric', true), '۱۴۰۵/۰۶/۱۳');
  assert.match(formatJalali(date, 'long', true), /۱۳ شهریور ۱۴۰۵$/);
});
