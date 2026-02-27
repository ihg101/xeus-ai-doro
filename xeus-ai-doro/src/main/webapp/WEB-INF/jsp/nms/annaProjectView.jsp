<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<style>
.contentWrapper {
	height: 100%;
}
#annaWrap {
	background: none;
	height: calc(100% - 50px);
}
#annaWrap ul {
	background: none;
	padding: none;
	padding-left: 1%;
}
#annaWrap div {
	padding: 0.0em 1.4em;
	height: calc(100% - 50px);
}

#annaWrap > div:last-child {height: auto;}

#annaWrap iframe {
	width: 100%;
	height: 95%;
	border: none;
}
#annaWrap #errorMsg {
	color: black;
    position: absolute;
    bottom: 12px;
    left: calc(50% - 200px);
    width: 400px;
    font-weight: bold;
    background: #EAEAEA;
}
#annaWrap .tab_wrap {display: flex; flex-flow: nowrap; width: 100%; padding: 0 !important; background: initial !important;}
#annaWrap .tab_wrap > li {flex: 1 1 25%; background: initial !important; border-bottom: 1px solid #000 !important; margin: 0; padding: 0; outline: 0;}
#annaWrap .tab_wrap > li.ui-tabs-active { border-bottom: 1px solid transparent !important;}
#annaWrap .tab_wrap > li > a {display: block; width: 100%; height: 50px; text-align: center; line-height: 50px; padding: 0 !important; outline: 0;}
</style>
<!-- <link rel="stylesheet" type="text/css" href="./common/ui-1.12.1/themes/ui-darkness/jquery-ui.css"> -->
<script>
(function(){
	$("#annaWrap").tabs();
})();
</script>
<div class="contentWrapper customScroll" data-mcs-theme="minimal-dark">
    <!-- <p class="searchTitle">AnnaProject</p> -->
	<div id="annaWrap">
		<ul class="tab_wrap">
			<li><a href="#tabs-1">1. CCTV 자산 현황</a></li>
			<li><a href="#tabs-2">2. 영상 데이터 처리 현황</a></li>
			<li><a href="#tabs-3">3. 영상 데이터 손실 현황</a></li>
			<li><a href="#tabs-4">4. CCTV 영상 열람 현황</a></li>
			<li><a href="#tabs-5">5. 사용자 운영 처리 현황</a></li>
			<li><a href="#tabs-6">6. CCTV 자산 세부 현황</a></li>
			<li><a href="#tabs-7">7. CCTV 영상 연결별 VMS 설정 상태</a></li>
			<li><a href="#tabs-8">8. 서버 리소스 사용 현황(1분/1일)</a></li>
			<li><a href="#tabs-9">9. 저장소 사용 현황(5분/7일)</a></li>
		</ul>
		<div id="tabs-1">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiYzQ3OTEzZWMtNDFhYi00NGZlLWE2Y2QtZjk4MDgzN2U0M2Q0IiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-2">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiODgyYzRhOGItNDJmMi00ODgxLWEwM2EtZTkyMjlhM2I1NGJiIiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-3">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiZGEyYWVjY2QtODdkMS00ZDYzLTgzZDEtNjYyNmU3OWVhY2I1IiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-4">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiZDc3M2NjMTMtNjc0Ny00MGU1LTgzMDMtOTRmODlhZTMzZDA1IiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-5">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiM2Y2OGI5NWMtYjE0Ny00ZjY4LWJlNzgtZGU1MjY2NzcwNmJlIiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-6">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiZmRmODc5NDgtYWQxZS00NDFhLWIyNjMtZDAxMmRkZDM1MGFjIiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-7">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiMGJhNzlkYTYtMmM0Yy00MzcyLTg5MjYtZmZjNzA2NDM1NGE3IiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-8">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiMzY4ZTUxMjgtNWY2OC00MGNkLWExMDgtM2NjZjdkNmJkYmQxIiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="tabs-9">
			<iframe src="https://app.powerbi.com/view?r=eyJrIjoiZWU5YTk2MjgtMjU5ZC00NDRlLWFiYmUtNmJlZDliMGRjODQwIiwidCI6IjY1MWUzNTI1LTg5NGYtNDY1YS1iYjBmLTdlYmE3YzI1MWI4MCIsImMiOjEwfQ%3D%3D"></iframe>
		</div>
		<div id="errorMsg">참고) 인터넷 사용이 불가능할 경우, 해당 기능은 사용이 제한됩니다.</div>
	</div>

</div>