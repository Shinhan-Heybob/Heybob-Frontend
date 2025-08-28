# HTTP 연결 설정 가이드

## app.json 설정 내용 설명

### iOS 설정
```json
"infoPlist": {
  "NSAppTransportSecurity": {
    "NSAllowsArbitraryLoads": true
  }
}
```
- **목적**: iOS에서 HTTP 통신 허용
- **설명**: iOS는 기본적으로 HTTPS만 허용하므로, 이 설정으로 HTTP도 사용 가능하게 함
- **주의**: 개발용으로만 사용, 앱스토어 배포시 제거 필요

### Android 설정
```json
"usesCleartextTraffic": true
```
- **목적**: Android에서 HTTP 통신 허용
- **설명**: Android 9+ 버전에서 평문(HTTP) 트래픽을 허용
- **주의**: 개발용으로만 사용, 실제 배포시 제거 필요

## 실서버 연결 방법

1. `.env` 파일에서 URL 변경:
   ```
   EXPO_PUBLIC_API_URL=http://your-server-ip:port/api
   ```

2. 웹소켓도 HTTP 서버와 함께 사용:
   ```
   ws://your-server-ip:port/ws
   ```

3. 앱 재시작:
   ```bash
   npm start
   ```

## 보안 주의사항
- **개발/테스트용으로만** 사용
- 실제 서비스 배포시에는 HTTPS/WSS 필수
- 앱스토어 심사시 이 설정들은 제거해야 함