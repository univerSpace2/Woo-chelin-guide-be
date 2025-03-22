/**
 * 문자열이 비어있는지 확인합니다.
 * @param str 확인할 문자열
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return str === null || str === undefined || str.trim() === '';
};

/**
 * 문자열을 주어진 길이로 자르고 말줄임표를 추가합니다.
 * @param str 원본 문자열
 * @param maxLength 최대 길이
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * 문자열에서 HTML 태그를 제거합니다.
 * @param html HTML 문자열
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * 문자열을 슬러그 형식으로 변환합니다.
 * @param str 원본 문자열
 */
export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
    .replace(/--+/g, '-'); // 중복 하이픈 제거
};
