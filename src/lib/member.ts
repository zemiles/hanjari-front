/** 탈퇴한 회원은 DB에 '탈퇴회원'으로 남고, 화면에는 '탈퇴한 회원'으로 보여 준다 (API 계약 P4) */
export function displayNickname(member: { nickname: string; withdrawn: boolean }): string {
  return member.withdrawn ? '탈퇴한 회원' : member.nickname
}
