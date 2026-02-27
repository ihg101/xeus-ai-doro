<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

	/* CD51 // 8대중과실 */
	/* HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
	Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
	Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator(); */

    //HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

%>
<script type="text/javascript">
	var typ = '이벤트 모니터링';
	var url = 'Evt';
</script>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.stat.css">
<script type="text/javascript" src="./res/menu/statView/geomex.xeus.stat.chart.js?t=<%= DateUtil.getStrMilSec() %>"></script>

<div id="searchBox"">

    <input type="hidden" id="offset" value="" /><%-- <%= offset %> --%>
    <input type="hidden" id="max" value="" />

    <!-- <div class="searchWrapper searchList"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">
        <!-- <p class="searchTitle">사용자 접속통계</p> -->
        <div class="statMenu" id="topMenu">
        	<button class="topMenuTab" id="statMenuTab" target="user" active="active">일반 현황</button><!-- active="active"  -->
			<button class="topMenuTab" id="statMenuTab" target="orgz">이벤트별 현황</button>
        </div>
		<div class="statContent" id="content">
		    <div class="page user">
				<div style="display: inline-block;">
					<div style="margin: 0 auto; display: inline-block;">
						<div class="chartWrap">
							<div style="display: inline-block;">
								<div style="margin: 0 auto; display: inline-block;">
									<div class="contentOption">
									</div>
									<div style="float:left;">
										<div class="subMenu">
											<button class="subMenuBtn" target="chart" active="active">그<br>래<br>프</button>
											<button class="subMenuBtn" target="table">테<br>이<br>블</button>
										</div>
									</div>
									<div style="float:left;">
										<div class="useritem chart" id="yearChart">
										</div>
										<div class="useritem table hidden customScroll" id="yearTable" style="overflow: auto;">
											<p class="exportExcel">연별 이벤트 모니터링 현황</p>
											<table>
												<thead>
												</thead>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>


					<div class="chartWrap"><!--  style="width:100%;" -->
						<div style="display: inline-block;">
							<div style="margin: 0 auto; display: inline-block;">
								<div class="contentOption">
									<select class="param year selectDate" gbn="Month"></select>
<!-- 									<span>연 :</span> -->
								</div>
								<div style="float:left;">
									<div class="subMenu">
										<button class="subMenuBtn" target="chart" active="active">그<br>래<br>프</button>
										<button class="subMenuBtn" target="table">테<br>이<br>블</button>
									</div>
								</div>
								<div style="float:left;">
									<div class="useritem chart" id="monthChart">
									</div>
									<div class="useritem table hidden customScroll" id="monthTable" style="overflow: auto;">
										<p class="exportExcel">월별 이벤트 모니터링 현황</p>
										<table>
											<thead>
											</thead>
											<tbody>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="display: inline-block;">
					<div style="margin: 0 auto; display: inline-block;">
						<div class="chartWrap" style="float:right;">
							<div style="display: inline-block;">
								<div style="margin: 0 auto; display: inline-block;">
									<div class="contentOption">
										<select class="param month selectDate" gbn="Day"></select>
<!-- 										<span>월 :</span> -->
										<select class="param year selectDate" gbn="Day"></select>
<!-- 										<span>연 :</span> -->
									</div>
									<div style="float:left;">
										<div class="subMenu">
											<button class="subMenuBtn" target="chart" active="active">그<br>래<br>프</button>
											<button class="subMenuBtn" target="table">테<br>이<br>블</button>
										</div>
									</div>
									<div style="float:left;">
										<div class="useritem chart" id="dayChart"><!--  style="width: 100%;" -->
										</div>
										<div class="useritem table hidden customScroll" id="dayTable" style="overflow: auto;">
											<p class="exportExcel">일별 이벤트 모니터링 현황</p>
											<table>
												<thead>
												</thead>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
			<div class="page orgz hidden">

				<div style="display: inline-block;">
					<div style="margin: 0 auto; display: inline-block;">
						<div class="chartWrap">
							<div style="display: inline-block;">
								<div style="margin: 0 auto; display: inline-block;">
									<div class="contentOption">
									</div>
									<div style="float:left;">
										<div class="subMenu">
											<button class="subMenuBtn" target="chart" active="active">그<br>래<br>프</button>
											<button class="subMenuBtn" target="table">테<br>이<br>블</button>
										</div>
									</div>
									<div style="float:left;">
										<div class="useritem chart" id="orgzYearChart">
										</div>
										<div class="useritem table hidden customScroll" id="orgzYearTable" style="overflow: auto;">
											<p class="exportExcel">연별 이벤트 모니터링 현황</p>
											<table>
												<thead>
												</thead>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>


					<div class="chartWrap"><!--  style="width:100%;" -->
						<div style="display: inline-block;">
							<div style="margin: 0 auto; display: inline-block;">
								<div class="contentOption">
									<select class="param year selectDate" gbn="OrgzMonth"></select>
<!-- 									<span>연 :</span> -->
								</div>
								<div style="float:left;">
									<div class="subMenu">
										<button class="subMenuBtn" target="chart" active="active">그<br>래<br>프</button>
										<button class="subMenuBtn" target="table">테<br>이<br>블</button>
									</div>
								</div>
								<div style="float:left;">
									<div class="useritem chart" id="orgzMonthChart">
									</div>
									<div class="useritem table hidden customScroll" id="orgzMonthTable" style="overflow: auto;">
										<p class="exportExcel">월별 이벤트 모니터링 현황</p>
										<table>
											<thead>
											</thead>
											<tbody>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="display: inline-block;">
					<div style="margin: 0 auto; display: inline-block;">
						<div class="chartWrap" style="float:right;">
							<div style="display: inline-block;">
								<div style="margin: 0 auto; display: inline-block;">
									<div class="contentOption">
										<select class="param month selectDate" gbn="OrgzDay"></select>
<!-- 										<span>월 :</span> -->
										<select class="param year selectDate" gbn="OrgzDay"></select>
<!-- 										<span>연 :</span> -->
									</div>
									<div style="float:left;">
										<div class="subMenu">
											<button class="subMenuBtn" target="chart" active="active">그<br>래<br>프</button>
											<button class="subMenuBtn" target="table">테<br>이<br>블</button>
										</div>
									</div>
									<div style="float:left;">
										<div class="useritem chart" id="orgzDayChart"><!--  style="width: 100%;" -->
										</div>
										<div class="useritem table hidden customScroll" id="orgzDayTable" style="overflow: auto;">
											<p class="exportExcel">일별 이벤트 모니터링 현황</p>
											<table>
												<thead>
												</thead>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

