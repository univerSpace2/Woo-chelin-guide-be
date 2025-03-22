import { ResponseFormat } from '../interfaces/response.interface';

/**
 * 성공 응답을 생성합니다.
 * @param data 응답 데이터
 * @param message 응답 메시지
 * @param meta 메타 데이터
 */
export const createSuccessResponse = <T>(
  data: T,
  message = '성공적으로 처리되었습니다.',
  meta: Record<string, any> = {},
): ResponseFormat<T> => {
  return {
    data,
    msg: message,
    meta,
  };
};

/**
 * 페이지네이션 응답을 생성합니다.
 * @param data 페이지 데이터
 * @param total 전체 항목 수
 * @param page 현재 페이지
 * @param limit 페이지당 항목 수
 * @param message 응답 메시지
 */
export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = '성공적으로 처리되었습니다.',
): ResponseFormat<T[]> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    msg: message,
    meta: {
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  };
};
