<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageVo"%>
<%@ include file="../common.jsp"%>
<%
	CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

	/* CD55 // 영상활용결과 */
	HashMap<String, String> chkUseRsCd = cde.convertCodeGrpToAllCde("C55");
	Set<String> chkUseRsCdKey = new TreeSet<String>(chkUseRsCd.keySet());
	Iterator<String> chkUseRsCdItr = chkUseRsCdKey.iterator();

	HashMap<String, String> param = (HashMap<String, String>) request.getAttribute("param");

	String procStatCd = param.get("procStatCd");
	String useRsCdNullChk = "";
	String offset = param.get("offset");
	String limit = param.get("limit");
	int max = (Integer) request.getAttribute("count");

	String chkParam = "";
	if (param.size() > 0) {
		if (param.containsKey("useRsCdNullChk")) {
			chkParam = "useRst";
			useRsCdNullChk = "Y";
		}
		if (param.containsKey("procStatCd")) {
			if ("SW".equals(param.get("procStatCd"))) {
				chkParam = "stat";
			}
		}
	}
	String sortCol = "";
	String sortTyp = "";
	String sortCntrl = "";
	if (param.get("sortCol") != null)
		sortCol = param.get("sortCol");
	if (param.get("sortTyp") != null)
		sortTyp = param.get("sortTyp");
	if (param.get("sortCntrl") != null)
		sortCntrl = param.get("sortCntrl");

	ArrayList<CrmsTransRqstVo> stat = (ArrayList<CrmsTransRqstVo>) request.getAttribute("stat");

	String swCnt = "";
	for (int i = 0; i < stat.size(); i++) {
		if ("SW".equals(stat.get(i).getProcStatCd())) swCnt = stat.get(i).getCnt();
	}

	int userRstCnt = 0;

	ArrayList<CrmsTransRqstVo> userst = (ArrayList<CrmsTransRqstVo>) request.getAttribute("userst");

	if(userst.size() > 0) userRstCnt = Integer.valueOf(userst.get(0).getCnt());

	ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) request.getAttribute("list");
%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">
<script type="text/javascript" src="./res/menu/tviusView/geomex.xeus.tvius.usr.rqst.view.js"></script>
<script type="text/javascript" src="./common/sysUsrSort.js"></script>
<script type="text/javascript">
var userId = '<%=userId%>';
var chkParam = '<%=chkParam%>';
var offset = '<%=offset%>';
var limit="<%=limit%>";
var sortCol = "<%=sortCol%>";
var sortTyp = "<%=sortTyp%>";
var sortCntrl = "<%=sortCntrl%>";
</script>
<div class="contentWrapper searchList customScroll">
	<input type="hidden" id="procStatCd" value="<%=procStatCd%>" />
	<input type="hidden" id="useRsCdNullChk" value="<%=useRsCdNullChk%>" />
	<input type="hidden" id="userId" value="<%=userId%>" />
	<input type="hidden" id="offset" value="<%=offset%>" />
	<input type="hidden" id="max" value="<%=max%>" />
	<input type="hidden" id="limit" value="<%=limit%>" />

	<div id="menu_bar" style="text-align: right;">
		<%-- 승인대기: <span class="cctvLookup" onclick="callListStat()"><%=("".equals(swCnt) ? "0" : swCnt)%>건</span> --%>
		<%-- 활용결과미등록 : <span class="cctvLookup" onclick="callListUse()"><%=("".equals(useRstCnt) ? "0" : useRstCnt)%>건</span> --%>
		<span>승인 대기 : </span>
		<button class="btn_style2 cctvLookup" onclick="callListStat();"><%=("".equals(swCnt) ? "0" : swCnt)%> 건</button>
		&nbsp; &nbsp; &nbsp;
        <span>활용 결과 미등록 : </span>
        <button class="btn_style2 cctvLookup" onclick="callListUse();"><%=userRstCnt%> 건</button>
        &nbsp; &nbsp; &nbsp;
		<button id="btn_list_all" class="btn_style2">전체보기</button>
	</div>

	<table style="table-layout: fixed;">
		<%
			String url = "/tvius/getUsrTviusRqstView.do";
		%>
		<thead>
			<tr>
				<th width="120"><span id='rqst.mgr_seq' class='mngSortBtn' url='<%=url%>'>신청번호</span></th>
				<th width="120"><span id='req_gbn_cd_rel_cde_nm' class='mngSortBtn' url='<%=url%>'>신청유형</span></th>
				<th width="210"><span id='crime_typ_rel_cde_nm' class='mngSortBtn' url='<%=url%>'>신청유형</span></th>
				<th><span id='rqst.cctv_list' class='mngSortBtn' url='<%=url%>'>CCTV 목록</span></th>
				<th width="100"><span id='rqst.reqst_dat' class='mngSortBtn' url='<%=url%>'>신청일</span></th>
				<th width="100"><span id='rqst.acpt_dat' class='mngSortBtn' url='<%=url%>'>승인일</span></th>
				<th width="120"><span id='proc_stat_cd_rel_cde_nm' class='mngSortBtn' url='<%=url%>'>처리상태</span></th>
				<th width="310"><span id='use_rs_cd_rel_cde_nm' class='mngSortBtn' url='<%=url%>'>활용결과</span></th>
				<th width="120"><span>영상목록</span></th>
			</tr>
		</thead>
<%
	if (list.size() == 0) {
%>
		<tr>
			<td colspan="9" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
		</tr>
<%
	} else {
		for (int i = 0; i < list.size(); i++) {
%>
		<tr>
			<td class="tCenter"><%=list.get(i).getMgrSeq()%></td>
			<td class="tCenter"><%=list.get(i).getReqGbnCdRelCdeNm()%></td>
			<td class="tCenter"><%=list.get(i).getCrimeTypRelCdeNm()%></td>
			<td class="tBlankLeft">
	<%
		String listStr = list.get(i).getCctvList();
			if (list.get(i).getCctvList().length() >= 100) {
				listStr = listStr.substring(0, 100) + "...";
			}

			if ("SW".equals(list.get(i).getProcStatCd()) || "SB".equals(list.get(i).getProcStatCd()) || "ED".equals(list.get(i).getProcStatCd())) {
	%>
			<span class="rqst_dtv" style="cursor: pointer;" mgrseq="<%=list.get(i).getMgrSeq()%>" procstat="<%=list.get(i).getProcStatCd()%>"> <%=listStr%></span>
	<%
	 		} else {
	%>
			<span> <%=listStr%></span>
	<%
 			}
	%>
			</td>
			<%-- <td><%=list.get(i).getCctvList() %></td> --%>
			<td class="tCenter"><%=DateUtil.formatDate(list.get(i).getReqstDat(), 8)%></td>
			<%
				if (list.get(i).getAcptDat() == null || "".equals(list.get(i).getAcptDat().trim())) {
			%>
			<td></td>
			<%
				} else {
			%>
			<td class="tCenter"><%=DateUtil.formatDate(list.get(i).getAcptDat(), 8)%></td>
			<%
				}
			%>
			<td class="tCenter">
				<ul class="result_bar" style="">
					<li>
						<div class="result_type" style=""></div>
					</li>
					<li>
						<div class="result_type"></div>
					</li>
					<li>
						<div class="result_type"></div>
					</li>
					<li>
						<div class="result_type"></div>
					</li>
					<li>
						<div style="margin-top: 5px;">
							<%-- <div <% if ( "SD".equals(list.get(i).getProcStatCd()) ) out.print(" class=\"tool rejt_cont\" cont=\""+list.get(i).getRejtResn()+"\"  title=\""+list.get(i).getRejtResn().replaceAll("\n","<br>")+"\" "); %>> --%>
							<label class="result_text"><%=list.get(i).getProcStatCdRelCdeNm()%></label>
						</div>
					</li>
				</ul>
			</td>
			<%-- <td class="tCenter"><%=list.get(i).getProcStatCdRelCdeNm() %></td> --%>
			<%
				//if(list.get(i).getUseRsCdRelCdeNam() == null){
				//if ("SK".equals(list.get(i).getProcStatCd()) && "11".equals(list.get(i).getUseRsCd())) {
				if ("SK".equals(list.get(i).getProcStatCd()) && !"11".equals(list.get(i).getUseRsCd())) {
			%>
			<td class="tCenter">
				<select id="useRsCd" name="useRsCd" class="use_rs_cd_<%=list.get(i).getMgrSeq()%>" intype="C" style="width: 200px; margin-top: 5px;">
					<option value="">선택하여 주십시오!</option>
			<%
					chkUseRsCdItr = chkUseRsCdKey.iterator();
					while (chkUseRsCdItr.hasNext()) {
						String str = (String) chkUseRsCdItr.next();
// 						if (!"99".equals(str.trim())) {
							if (str.equals(list.get(i).getUseRsCd())) {
			%>
					<option value="<%=str%>" selected="selected"><%=chkUseRsCd.get(str)%></option>

			<%
							} else {
			%>
					<option value="<%=str%>"><%=chkUseRsCd.get(str)%></option>
			<%
							}
// 						}
					}
			%>
				</select>
				<button class="btn_use_rs_cd btn_style2" style="margin-top: 5px; margin-bottom: 5px;" mgrseq="<%=list.get(i).getMgrSeq()%>">결과 저장</button></td>
			<%
				} else {
			%>
			<td class="tCenter"><%=StrUtil.chkNull(list.get(i).getUseRsCdRelCdeNm())%></td>
			<%
				}
			%>
			<td class="tCenter">
				<button class="videoList innerBtn btn_style2" mgrseq="<%=list.get(i).getMgrSeq()%>" reqGbn="<%=list.get(i).getReqGbnCdRelCdeNm()%>" videosmy="<%=list.get(i).getVideoSmy()%>">목록보기</button>
			</td>
		</tr>
	<%
			}
		}
	%>
	</table>

	<div class="paging_wrap"></div>

	<div id="videoListView">
		<!--  style="height:50%;" -->
	</div>

</div>
