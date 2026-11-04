/* Pure calendar functions shared by Node tests, the Shell extension, and GJS. */

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

export const PERSIAN_WEEKDAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه',
];

const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
  1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

function div(a, b) {
  return Math.trunc(a / b);
}

function mod(a, b) {
  return a - Math.trunc(a / b) * b;
}

function jalCal(jy, withoutLeap = false) {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;

  if (jy < jp || jy >= breaks[bl - 1])
    throw new RangeError(`Invalid Jalali year: ${jy}`);

  for (let i = 1; i < bl; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm)
      break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4)
    leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (withoutLeap)
    return { gy, march };
  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1)
    leap = 4;
  return { leap, gy, march };
}

function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy, jm, jd) {
  const r = jalCal(jy, true);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31
    - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn) {
  const { gy } = d2g(jdn);
  let jy = gy - 621;
  const r = jalCal(jy, false);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185)
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1)
      k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export function isJalaliLeapYear(jy) {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy, jm) {
  if (jm < 1 || jm > 12)
    throw new RangeError('Jalali month must be between 1 and 12');
  if (jm <= 6)
    return 31;
  if (jm <= 11)
    return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

export function isValidJalaliDate(jy, jm, jd) {
  try {
    return Number.isInteger(jy) && Number.isInteger(jm) && Number.isInteger(jd)
      && jd >= 1 && jd <= jalaliMonthLength(jy, jm);
  } catch (_) {
    return false;
  }
}

export function toGregorian(jy, jm, jd) {
  if (!isValidJalaliDate(jy, jm, jd))
    throw new RangeError('Invalid Jalali date');
  return d2g(j2d(jy, jm, jd));
}

export function toJalali(gy, gm, gd) {
  const date = new Date(Date.UTC(gy, gm - 1, gd));
  if (date.getUTCFullYear() !== gy || date.getUTCMonth() !== gm - 1 || date.getUTCDate() !== gd)
    throw new RangeError('Invalid Gregorian date');
  return d2j(g2d(gy, gm, gd));
}

export function jalaliToDate(jy, jm, jd) {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd, 12, 0, 0);
}

export function dateToJalali(date = new Date()) {
  return toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function toPersianDigits(value) {
  return String(value).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

export function toEnglishDigits(value) {
  return String(value).replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}

export function formatJalali(date, style = 'long', persianDigits = true) {
  const { jy, jm, jd } = dateToJalali(date);
  const weekday = PERSIAN_WEEKDAYS[date.getDay()];
  const values = {
    numeric: `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`,
    medium: `${weekday} ${jd} ${PERSIAN_MONTHS[jm - 1]}`,
    long: `${weekday} ${jd} ${PERSIAN_MONTHS[jm - 1]} ${jy}`,
  };
  const result = values[style] ?? values.long;
  return persianDigits ? toPersianDigits(result) : result;
}

export function addJalaliMonths(jy, jm, delta) {
  const zeroBased = jy * 12 + jm - 1 + delta;
  return { jy: Math.floor(zeroBased / 12), jm: mod(zeroBased, 12) + 1 };
}
