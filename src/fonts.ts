// 한글 글꼴은 @font-face 선언만 200KB가 넘어서, 첫 화면을 그린 뒤 따로 불러온다.
// 불러오기 전에는 시스템 글꼴(Apple SD Gothic Neo, 맑은 고딕)로 보인다.
// 굵기는 400·700 두 개만 쓴다 (600은 브라우저가 700으로 맞춘다)
import '@fontsource/ibm-plex-sans-kr/400.css'
import '@fontsource/ibm-plex-sans-kr/700.css'
