/** 조건부 클래스 이름을 이어 붙인다 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
