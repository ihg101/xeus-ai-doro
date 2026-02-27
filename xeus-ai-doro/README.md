-- version 2026.01.27

##관련 테이블
v_mon_evet_list  굴삭기/낙하물 
 - 굴삭기 : 이벤트 모니터링 리스트 표출, feature 레이어 그리기.       
 - 낙하물 : 이벤트 모니터링 왼쪽 리스트 표출.
v_mon_evet_blackice 블랙아이스/ 수막현상
 - 태백시 전용
 - 이벤트 모니터링 왼쪽 리스트, feature 레이어 그리기
v_mon_evet_fall - 낙하물 
 - feature 레이어 용도
v_event_pothole - 포트홀 
v_event_crack - 크랙
mon_evet_hist
eocs_excavator - 가스공사 데이터(춘천시)
eocs_pipe_low - 저압 배관망(춘천시)
eocs_pipe_mid - 중압 배관망(춘천시)

##이벤트 코드
001 - 포트홀
002 - 낙하물
003 - 콘
004 - 굴삭기
005 - 크랙
006 - 블랙아이스 (태백시)
007 - 수막현상 (태백시)

## feature 표출, 이벤트 관련 파일
geomex.xeus.map.widget.js
gmx.gis.layer.js
geomex-xeus-smartcity-event.xml
WebSocketController.java

## 정책
1. 굴삭기(004), 낙하물(002) 이벤트는 반경 설정 가능
  - 동일한 이벤트인 경우, 반경 값(evt_json 컬럼의 dist) 에 따라서 반경에 포함되면 지도, 이벤트 모니터링 왼쪽 리스트에 표출 안됨.
  - 신규 이벤트가 기존 이벤트의 반경에 포함된 경우에도 DB에 저장은 하지만, 지도상에 표출 안됨.
2. 이벤트 모니터링의 왼쪽 리스트는 geomex-xeus-smartcity-event.xml의 getList 를 사용해서 각 이벤트의 반경 값 계산 후 그림.
3. 지도에 표출되는 굴삭기, 낙하물 feature의 경우 gmx.gis.layer.js 의 checkEventDist 함수를 통해서  각 이벤트의 반경 값 계산 후 그림.
4. 이벤트가 동일한 위치에 있는 경우에는 가장 먼저 발생된 이벤트가 우선,
5. EOCS 데이터의 경우 종료일자가 지난경우 표출 안됨.
6. AutoEventEndService.java 를 통해  mon_evet_list 의 데이터는, 매일 자정에 현재날짜 이전 데이터는  mon_evet_hist 로 이동.(state값이 1(확인) 제외)
7. 모든 레이어는 엔진을 통해서 그림.
8. 이벤트 모니터링의 왼쪽 리스트 상태값이 확인일 경우, 상단 고정.
9. 이벤트 상태 값 변경 -> 오탐 : 2, 종료 : 99 일 경우 해당 이벤트 삭제 및 리스트 표출 x
10. 블랙아이스/ 수막현상 이벤트일 경우 반경 50m 상시 표출, 상태값은 "위험" 으로 고정
11. 신규이벤트는 mt_auth_list, mt_cmm_cde 테이블에 추가 후, 권한 부여 해야 됨.
