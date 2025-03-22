/**
 * 현재 날짜와 시간을 ISO 형식으로 반환합니다.
 */
export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};

/**
 * 주어진 날짜에 일수를 더합니다.
 * @param date 기준 날짜
 * @param days 더할 일수
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 두 날짜 사이의 일수 차이를 계산합니다.
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // 밀리초 단위의 하루
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
};

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 포맷합니다.
 * @param date 포맷할 날짜
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
