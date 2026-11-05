// API 계약(백엔드 저장소 docs/api-contract.md)의 요청·응답 타입.
// 계약이 바뀌면 계약 문서를 먼저 고치고 이 파일을 맞춘다

/** 모든 에러 응답 */
export type ErrorResponse = { status: number; code: string; message: string }

// ── 회원·인증 ─────────────────────────────

export type MemberMe = { id: number; nickname: string; email: string | null }

export type LoginResult =
  | { result: 'LOGGED_IN'; member: MemberMe; returnTo: string }
  | { result: 'SIGNUP_REQUIRED'; kakaoNickname: string | null; returnTo: string }

export type NicknameCheck = {
  available: boolean
  reason: null | 'INVALID_FORMAT' | 'NOT_ALLOWED' | 'DUPLICATED'
}

export type SignupResult = { member: MemberMe; returnTo: string }

// ── 클럽 ─────────────────────────────────

export type Visibility = 'PUBLIC_LINK' | 'MEMBERS_ONLY'
export type PenaltyScope = 'MEETUP' | 'CLUB'
export type SuccessionMode = 'AUTO' | 'VOTE'
export type ClubStatus = 'ACTIVE' | 'CLOSING' | 'CLOSED'
export type Role = 'OWNER' | 'VICE_OWNER' | 'MANAGER' | 'MEMBER'
export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'LEFT' | 'KICKED'
export type Permission = 'MEETUP_MANAGE' | 'APPLY_MANAGE' | 'ATTENDANCE_MANAGE' | 'MEMBER_MANAGE'

export type ClubCreate = {
  name: string
  description: string
  visibility: Visibility
  penaltyScope: PenaltyScope
  successionMode: SuccessionMode
}

export type ClubDetail = ClubCreate & {
  id: number
  status: ClubStatus
  closesAt: string | null
  ownerVacant: boolean
  activeMemberCount: number
  my: {
    membershipId: number
    role: Role
    status: MembershipStatus
    permissions: Permission[]
    isOwner: boolean
    /** KICKED이고 재가입을 요청했으면 true ('승인 대기 중' 표시) */
    rejoinRequested: boolean
  } | null
}

export type ClubSummary = {
  id: number
  name: string
  myRole: Role
  activeMemberCount: number
  status: ClubStatus
}

/** 클럽 가입 결과: 공개 클럽 ACTIVE, 멤버 전용 PENDING, 내보내진 사람은 KICKED 그대로(재가입 요청됨) */
export type JoinResult = {
  membershipId: number
  status: 'ACTIVE' | 'PENDING' | 'KICKED'
  rejoinRequested: boolean
}

export type Membership = {
  membershipId: number
  memberId: number
  /** 탈퇴한 회원은 '탈퇴회원'. 화면에는 displayNickname()으로 보여 준다 */
  nickname: string
  withdrawn: boolean
  role: Role
  status: MembershipStatus
  joinedAt: string | null
  requestedAt: string
  rejoinRequestedAt: string | null
}

export type PermissionRow = {
  membershipId: number
  nickname: string
  role: 'VICE_OWNER' | 'MANAGER'
  permissions: Record<Permission, boolean>
  fixed: boolean
}

// ── 승계·투표 (HJR-28·29 설계 뒤 확정) ────────────

export type Succession = {
  reason: 'LEFT' | 'INACTIVE_60_DAYS' | 'ABSENCE_REPORT' | 'VOTE_MODE'
  stage: 'PRESENCE_CHECK' | 'CANDIDATE_ANSWER' | 'CONSENT' | 'VOTE'
  candidateNickname: string | null
  deadline: string
  myAction: 'ANSWER' | 'CONSENT' | 'PRESENCE' | null
}

export type Vote = {
  voteId: number
  kind: 'MANAGER_VOTE' | 'CLUB_VOTE'
  stage: 'CANDIDACY' | 'VOTING' | 'RUNOFF' | 'APPROVAL'
  deadline: string
  candidates: { memberId: number; nickname: string; votes: number | null }[]
  /** 후보 모집 시작 때 고정한 투표 명단 인원 (활동 중 + 가입 7일 이상) */
  eligibleVoterCount: number
  myEligible: boolean
  myBallotCast: boolean
}

// ── 회차 ─────────────────────────────────

export type PromotionMode = 'AUTO' | 'MANUAL'
export type MeetupStatus = 'SCHEDULED' | 'CANCELLED'

export type MeetupCreate = {
  title: string
  place: string
  startsAt: string
  capacity: number
  applyOpensAt: string
  applyClosesAt: string
  waitlistEnabled: boolean
  waitlistCapacity: number | null
  promotionMode: PromotionMode
  manualFallbackMinutes: number | null
  attendanceWindowMinutes: number
  qrRadiusMeters: number
}

export type MeetupSummary = {
  id: number
  title: string
  place: string
  startsAt: string
  status: MeetupStatus
  capacity: number
  confirmedCount: number
  waitingCount: number
  applyOpensAt: string
  applyClosesAt: string
}

export type MeetupDetail = MeetupCreate & {
  id: number
  status: MeetupStatus
  cancelledAt: string | null
  confirmedCount: number
  waitingCount: number
  attendanceOpenedAt: string | null
  club: { id: number; name: string; visibility: Visibility }
  serverTime: string
  myApply: MyApply | null
  can: { manageMeetup: boolean; manageApply: boolean; manageAttendance: boolean }
}

// ── 신청 ─────────────────────────────────

export type ApplyStatus =
  | 'WAITING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'MEETUP_CANCELLED'

export type MyApply = {
  applyId: number
  status: ApplyStatus
  waitingSeq: number | null
  waitingRank: number | null
  appliedAt: string
  confirmedAt: string | null
  endedAt: string | null
  attendance: AttendanceRecord | null
}

export type Roster = {
  confirmed: {
    applyId: number
    memberId: number
    nickname: string
    withdrawn: boolean
    confirmedAt: string
    attendance: AttendanceRecord | null
  }[]
  waiting: {
    applyId: number
    memberId: number
    nickname: string
    withdrawn: boolean
    waitingSeq: number
    waitingRank: number
    appliedAt: string
  }[]
}

export type MyApplyHistory = MyApply & {
  meetup: { id: number; title: string; startsAt: string; status: MeetupStatus }
  club: { id: number; name: string }
}

// ── 출석·노쇼·패널티 ───────────────────────

export type AttendanceStatus = 'ATTENDED' | 'LATE' | 'NO_SHOW'

export type AttendanceRecord = {
  status: AttendanceStatus
  checkedAt: string | null
  checkMethod: 'SELF' | 'STAFF' | null
}

export type AttendanceToken = { token: string; code: string; checkinUrl: string; expiresAt: string }

export type Penalty = {
  penaltyId: number
  memberId: number
  nickname: string
  withdrawn: boolean
  meetup: { id: number; title: string; startsAt: string }
  scope: PenaltyScope
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED'
  createdAt: string
}

export type MemberAttendance = {
  meetup: { id: number; title: string; startsAt: string }
  record: AttendanceRecord
}
