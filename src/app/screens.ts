/**
 * 화면 목록 (API 계약 7절). 아직 만들지 않은 화면은 PlaceholderPage로 뜨고,
 * 각 Jira 작업에서 진짜 화면으로 바꾼다
 */
export type Screen = {
  path: string
  title: string
  /** 이 화면을 만드는 Jira 작업 */
  ticket: string
  /** 로그인이 필요한 화면 */
  auth: boolean
  /** 개발용 화면 목록에서 열어 볼 예시 주소 */
  example?: string
}

export const screens: Screen[] = [
  { path: '/auth/kakao/callback', title: '로그인 처리 중', ticket: 'HJR-95', auth: false },
  { path: '/signup/nickname', title: '닉네임 정하기', ticket: 'HJR-96', auth: false },
  { path: '/me', title: '내 정보', ticket: 'HJR-97', auth: true },
  { path: '/me/applies', title: '내 신청 내역', ticket: 'HJR-97', auth: true },
  { path: '/clubs/new', title: '클럽 만들기', ticket: 'HJR-98', auth: true },
  { path: '/clubs/:clubId', title: '클럽', ticket: 'HJR-98', auth: false, example: '/clubs/1' },
  { path: '/clubs/:clubId/settings', title: '클럽 설정', ticket: 'HJR-98', auth: true, example: '/clubs/1/settings' },
  { path: '/clubs/:clubId/members', title: '멤버', ticket: 'HJR-99', auth: true, example: '/clubs/1/members' },
  { path: '/clubs/:clubId/permissions', title: '운영진 권한', ticket: 'HJR-100', auth: true, example: '/clubs/1/permissions' },
  { path: '/clubs/:clubId/succession', title: '클럽장 승계', ticket: 'HJR-106', auth: true, example: '/clubs/1/succession' },
  { path: '/clubs/:clubId/penalties', title: '노쇼 리스트', ticket: 'HJR-105', auth: true, example: '/clubs/1/penalties' },
  { path: '/clubs/:clubId/meetups/new', title: '회차 만들기', ticket: 'HJR-101', auth: true, example: '/clubs/1/meetups/new' },
  { path: '/meetups/:meetupId', title: '회차', ticket: 'HJR-102', auth: false, example: '/meetups/1' },
  { path: '/meetups/:meetupId/edit', title: '회차 수정', ticket: 'HJR-101', auth: true, example: '/meetups/1/edit' },
  { path: '/meetups/:meetupId/roster', title: '명단', ticket: 'HJR-103', auth: true, example: '/meetups/1/roster' },
  { path: '/meetups/:meetupId/attendance', title: '출석 체크', ticket: 'HJR-104', auth: true, example: '/meetups/1/attendance' },
  { path: '/checkin', title: '출석하기', ticket: 'HJR-104', auth: false },
  { path: '/privacy', title: '개인정보 처리방침', ticket: 'HJR-107', auth: false },
]
