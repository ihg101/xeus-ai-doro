<%@ page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.util.code.CodeConvertor" %> --%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%-- <%@ page import="geomex.xeus.util.code.DateUtil" %> --%>
<%@ page import="geomex.xeus.util.login.LoginManager"%>
<%@ page import="java.util.List"%>
<%-- <%@ page import="java.util.Iterator"%> --%>
<%-- <%@ page import="java.util.HashMap"%> --%>
<%-- <%@ page import="java.util.TreeSet"%> --%>
<%@ include file="../common.jsp"%>
<%
    LoginManager login = LoginManager.getInstance();
	ArrayList sessUserList = login.getUserList();

	ArrayList<CrmsTransRqstVo> pageCnt = (ArrayList<CrmsTransRqstVo>) request.getAttribute("pageCnt");

	int swCnt = pageCnt.get(0).getRqstCntSw(); // 반출 승인대기 건수
	int snCnt = pageCnt.get(0).getRqstCntSn(); // 반출 처리중 건수
	int rsCnt = pageCnt.get(0).getRqstCntRs(); // 반출 활용결과 미입력 건수
	int extCnt = pageCnt.get(0).getRenewCntExt(); // 연장신청 승인대기 건수
	int eviCnt = pageCnt.get(0).getRenewCntEvi(); // 증거자료신청 승인대기 건수
	int usrSwCnt = pageCnt.get(0).getUsrCnt(); // 사용자 승인대기 건수
	int lockUsr = pageCnt.get(0).getLockUsr(); // 계정잠김 수

	int noIpLen = 0; //IP 미등록 사용자 수
	String usrIdRst = pageCnt.get(0).getUsrIdRst();
	if (!StrUtil.isEmpty(usrIdRst))
		noIpLen = usrIdRst.split(",").length;
%>
<script type="text/javascript" src="<%=context%>/res/menu/tviusMngView/geomex.xeus.tvius.mng.board.view.js"></script>
<script type="text/javascript">
    var userId = '<%=userId%>';
    var sessUserList = '<%=sessUserList%>';
	var timer = null;
	var delta = 300;
</script>

<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">
<style>
.tab_on {
	position: relative;
	display: inline-block;
	height: 24px;
	border-left: solid 1px #1f1f24;
	border-top: solid 1px #1f1f24;
	border-right: solid 1px #1f1f24;
	border-bottom: solid 1px #212228;
	background-color: #21222B;
	padding: 5px 10px 0 10px;
	font-weight: bold;
	font-size: 10pt;
	color: #ffffff;
	cursor: default;
}

.tab_bg {
	font-weight: normal !important;
	color: #999999 !important;
	border-bottom: solid 1px #1f1f24 !important;
	cursor: pointer !important;
}

#chart .chart_tab {
	list-style: none;
	float: left;
}
</style>
<div class="searchWrapper customScroll" style="height: 100%; background: #3e3f48;">
	<div id="admin_top_content">
		<div class="corner_parent" align="center" style="margin-top: 5px;">
			<div id="top" class="corner_center">
				<div id="top1" class="corner_group">
					<p class="pageNam">영상정보신청현황</p>
					<div class="corner_content_group">
						<div class="move_page_wrap">
							<div key="crms_trans_rqst" class="move_page corner_1_1">
								<div class="text_wrap">
									<div id="rqst_sw" class="result_num"><%=swCnt%></div>
									<p class="result_title">영상신청<br>승인대기</p>
								</div>
							</div>
							<div key="crms_trans_rqst" class="move_page corner_1_2">
								<div class="text_wrap">
									<div id="rqst_sn" class="result_num"><%=snCnt%></div>
									<p class="result_title">
										처리중<br>&nbsp;
									</p>
								</div>
							</div>
							<div key="crms_trans_rqst" class="move_page corner_1_3">
								<div class="text_wrap">
									<div id="rqst_rs" class="result_num"><%=rsCnt%></div>
									<p class="result_title">활용결과 미입력<br>&nbsp;</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="top2" class="corner_group">
					<p class="pageNam">연장/증거자료 신청 현황</p>
					<div class="corner_content_group">
						<div class="move_page_wrap">
							<div key="crms_rqst_renew_11" class="corner_1_1 move_page">
								<div class="text_wrap">
									<div id="renew_r1" class="result_num"><%=extCnt%></div>
									<p class="result_title" style="margin-top: 24px">연장신청<br>승인대기</p>
								</div>
							</div>
							<div key="crms_rqst_renew_12" style="margin-left: 20px;" class="corner_1_1 move_page">
								<div class="text_wrap">
									<div id="renew_r2" class="result_num"><%=eviCnt%></div>
									<p class="result_title" style="margin-top: 24px;">증거자료신청<br>승인대기</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="top3" class="corner_group">
					<p class="pageNam">사용자승인현황</p>
					<div class="corner_content_group">
						<div class="move_page_wrap">
							<div key="crms_user" class="corner_1_1 move_page">
								<div class="text_wrap">
									<div id="use" class="result_num"><%=usrSwCnt%></div>
									<p class="result_title">사용자 승인대기<br>&nbsp;</p>
								</div>
							</div>
							<div key="crms_user" class="move_page corner_1_3">
								<div class="text_wrap">
									<div id="notip" class="result_num"><%=noIpLen%></div>
									<p class="result_title">승인된 사용자<br>&nbsp;</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="top4" class="corner_group">
					<p class="pageNam">사용자접속현황</p>
					<div class="corner_content_group">
						<div class="move_page_wrap">
							<div key="crms_user" style="margin-left: 0;" class="move_page corner_1_4">
								<div class="text_wrap">
									<div id="preuse" class="result_num"><%=sessUserList.size()%></div>
									<p class="result_title">현재접속자<br>&nbsp;</p>
								</div>
							</div>
							<div key="crms_user" class="move_page corner_1_3">
								<div class="text_wrap">
									<div id="uselock" class="result_num"><%=lockUsr%></div>
									<p class="result_title">계정잠김<br>&nbsp;</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="corner_parent" align="center" style="margin-top: 10px;">
		<div id="bottom" class="corner_center">
			<div id="chart" class="ifa_corner_group bottomElement">
				<p class="pageNam">영상정보신청현황</p>
				<div class=" ifa_corner_content_group">
					<div>
						<ul>
							<li class="chart_tab">
								<div id="listuse" class="tab_on" align="left" style="margin-left: 15px;">CCTV활용영상</div>
							</li>
							<li class="chart_tab">
								<div id="listsolve" class="tab_on tab_bg" align="left">사건해결 기여율</div>
							</li>
							<li class="chart_tab">
								<div id="listcrime" class="tab_on tab_bg" align="left">범죄유형별 신청현황</div>
							</li>
							<li class="chart_tab">
								<div id="listnouse" class="tab_on tab_bg" align="left">미사용사유별 현황</div>
							</li>
<!-- 							<li class="chart_tab"> -->
<!-- 								<div id="listview" class="tab_on tab_bg" align="left">CCTV별 반출현황</div> -->
<!-- 							</li> -->
<!-- 							<li class="chart_tab"> -->
<!-- 								<div id="listorg" class="tab_on tab_bg" align="left">기관별 영상반출 현황</div> -->
<!-- 							</li> -->
						</ul>
					</div>
				</div>
				<div id="boardChart"></div>
			</div>
			<div id="stat" class="stat_corner_group bottomElement">
				<p class="pageNam">서버 현황</p>
				<div class="stat_content">
					<div class="stat_progress_content">
						<div class="stat_progress_grp">
							<div class="stat_progress_name">CPU</div>
							<div id="pkg_cpu" class="stat_progress_bar"></div>
							<div id="pkg_cpu_num" class="stat_progress_num">Loading...</div>
						</div>
						<div class="stat_progress_grp">
							<div class="stat_progress_name">MEM</div>
							<div id="pkg_mem" class="stat_progress_bar"></div>
							<div id="pkg_mem_num" class="stat_progress_num">Loading...</div>
						</div>
						<div class="stat_progress_grp">
							<div class="stat_progress_name">HDD</div>
							<div id="pkg_hdd" class="stat_progress_bar"></div>
							<div id="pkg_hdd_num" class="stat_progress_num"> Loading...</div>
						</div>
					</div>
				</div>
				<div class="process_content">
					<div class="process_wrap">
						<div class="process_grp">
							<span class="process_on">
								<span class="process_nam">BackUp Process</span>
								<img id="back_on" src="/xeus/res/img/2_off.png" alt="서버 ON">
							</span>
						</div>
						<div class="process_hint">
							<span>- VMS에서 영상을 반출하는 프로세스입니다.</span>
						</div>
						<div class="process_grp">
							<span class="process_on">
								<span class="process_nam">Sync Service</span>
								<img id="sync_on" src="/xeus/res/img/2_off.png" alt="서버 ON">
							</span>
						</div>
						<div class="process_hint">
							<span>- CCTV 데이터를 동기화해주는 서비스입니다.</span>
						</div>
						<div class="process_grp">
							<span class="process_on">
								<span class="process_nam">Package Service</span>
								<img id="pkg_on" src="/xeus/res/img/2_off.png" alt="서버 ON">
							</span>
						</div>
						<div class="process_hint">
							<span>- 반출한 영상을 암호화해주는 서비스입니다.</span>
						</div>
						<div class="process_grp">
							<span class="process_on">
								<span class="process_nam">PrevPackage Service</span>
								<img id="prevpkg_on" src="/xeus/res/img/2_off.png" alt="서버 ON">
							</span>
						</div>
						<div class="process_hint">
							<span>- 미리보기 영상을 암호화해주는 서비스입니다.</span>
						</div>
						<div class="process_grp">
							<span class="process_on">
								<span class="process_nam">RePackage Service</span>
								<img id="repkg_on" src="/xeus/res/img/2_off.png" alt="서버 ON">
							</span>
						</div>
						<div class="process_hint">
							<span>- 연장/증거자료 영상을 재암호화해주는 서비스입니다.</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>