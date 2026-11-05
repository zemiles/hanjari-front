/** 화면에서 분기할 때 쓰는 에러 코드 (백엔드 ErrorType의 code) */
export const ErrorCode = {
  // 회원
  MEMBER_NICKNAME_DUPLICATED: '1003',
  MEMBER_ALREADY_REGISTERED: '1004',
  MEMBER_NICKNAME_NOT_ALLOWED: '1005',
  // 클럽
  CLUB_NOT_FOUND: '2001',
  CLUB_PERMISSION_DENIED: '2002',
  CLUB_CLOSED: '2003',
  CLUB_ALREADY_JOINED: '2005',
  CLUB_VICE_OWNER_ALREADY_EXISTS: '2008',
  CLUB_SETTINGS_LOCKED: '2010',
  CLUB_MEMBERS_ONLY: '2011',
  // 회차
  MEETUP_NOT_FOUND: '3001',
  MEETUP_ALREADY_CANCELLED: '3002',
  MEETUP_ALREADY_STARTED: '3003',
  MEETUP_CAPACITY_BELOW_CONFIRMED: '3004',
  MEETUP_INVALID_PERIOD: '3005',
  // 신청
  APPLY_ALREADY_EXISTS: '4001',
  APPLY_INVALID_TRANSITION: '4002',
  APPLY_NOT_OPENED: '4004',
  APPLY_CLOSED: '4005',
  APPLY_FULL: '4006',
  APPLY_MEMBERS_ONLY: '4007',
  APPLY_BLOCKED_BY_PENALTY: '4008',
  APPLY_IDEMPOTENCY_KEY_REUSED: '4010',
  APPLY_BLOCKED_BY_KICK: '4011',
  // 출석
  ATTENDANCE_NOT_OPENED: '5001',
  ATTENDANCE_WINDOW_CLOSED: '5002',
  ATTENDANCE_ALREADY_RECORDED: '5003',
  ATTENDANCE_INVALID_TOKEN: '5006',
  ATTENDANCE_OUT_OF_RANGE: '5007',
  ATTENDANCE_WINDOW_NOT_ENDED: '5008',
  // 인증
  UNAUTHORIZED: '8001',
  KAKAO_LOGIN_FAILED: '8004',
  KAKAO_INVALID_CODE: '8005',
  OAUTH_STATE_INVALID: '8006',
  // 공통
  SYSTEM_ERROR: '9001',
  DB_ERROR: '9002',
  VALID_ERROR: '9003',
  CSRF_REJECTED: '9009',
  TEMPORARILY_UNAVAILABLE: '9010',
  // 프론트에서만 쓰는 코드
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
} as const

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode]

const GENERIC_MESSAGE = '일시적인 오류입니다. 잠시 후 다시 시도해 주세요.'

/** 서버가 준 ErrorResponse, 또는 네트워크 오류를 담는다 */
export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }

  static network() {
    return new ApiError(0, ErrorCode.NETWORK, '인터넷 연결을 확인한 뒤 다시 시도해 주세요.')
  }

  static unknown(status: number) {
    return new ApiError(status, ErrorCode.UNKNOWN, GENERIC_MESSAGE)
  }
}

export function isApiError(error: unknown, code?: string): error is ApiError {
  return error instanceof ApiError && (code === undefined || error.code === code)
}

export function isUnauthorized(error: unknown): boolean {
  return isApiError(error, ErrorCode.UNAUTHORIZED)
}

/** 화면에 보여 줄 문구. 서버 메시지가 있으면 그대로 쓴다 */
export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_MESSAGE
}
