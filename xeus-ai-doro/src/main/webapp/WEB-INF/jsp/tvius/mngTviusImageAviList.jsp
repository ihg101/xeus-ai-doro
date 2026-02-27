<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%> --%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%

String rqstMgrSeq = (String)request.getAttribute("mgrseq");

HashMap<String, String> sysParam = (HashMap<String, String>)request.getAttribute("sysparam");

String maskingYn = sysParam.get("tvius.masking_yn");

ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>)request.getAttribute("list");

%>
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.avi.view.js"></script>
<script type="text/javascript">

var rqstMgrSeq = '<%=rqstMgrSeq%>';
var maskingYn = '<%= maskingYn %>';
var userId = '<%=userId%>';
//var reqstId = $(".contentWrapper").find('#searchBox').find('#reqstId').text();
var reqstId = $(".contentWrapper").find('#reqstId').text();

</script>

<div id="serchBox2">
    <div class="tableWrapper searchList">

        <table id="data_table">
            <colgroup>
                <col width="" />
                <col width="160" />
                <col width="160" />
                <col width="160" />
                <col width="160" />

            </colgroup>
            <tr>
                <th rowspan="2">CCTV명</th>
                <th rowspan="2">시작시간</th>
                <th rowspan="2">종료시간</th>
                <th rowspan="2">재생 횟수제한</th>
                <th rowspan="2">재생 만료일</th>
            </tr>
            <tbody id="avi_list_body">
                <%
                 if (list.size() == 0){
                %>
                <tr>
                    <td colspan="7" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
                </tr>
                <%
                 } else {
                      for(int i=0; i<list.size(); i++){

                          String realFileName = list.get(i).getMgrSeq()+"_"+list.get(i).getRqstMgrSeq()+"_"+list.get(i).getVdwkFileSeq();
                          String orgLimitDat = list.get(i).getAviPlayLimitDat();
                          if ( orgLimitDat != null && !"0".equals(orgLimitDat.trim()) ) {
                              orgLimitDat = DateUtil.formatDate(list.get(i).getAviPlayLimitDat(), 8);
                          } else {
                              orgLimitDat = "-";
                          }
                %>
                <tr>
                    <td style="margin-left: 10px;"><%=list.get(i).getCctvLabel()%></td>
                    <td><%=DateUtil.formatDate(list.get(i).getSecStDat())%></td>
                    <td><%=DateUtil.formatDate(list.get(i).getSecEdDat())%></td>
                    <td><%=list.get(i).getPlayLimitCnt()%></td>
                    <td><%=orgLimitDat%></td>

                </tr>

                <%
                      }
                  }
                %>
            </tbody>
        </table>

    </div>
</div>

