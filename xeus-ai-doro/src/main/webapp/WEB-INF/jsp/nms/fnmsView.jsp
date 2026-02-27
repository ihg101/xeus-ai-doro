<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%-- <%@ page import="geomex.xeus.equipmgr.service.CctvVo"%> --%>
<%@ include file="../common.jsp" %>
<%
/* CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C14");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");

HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");
 */
%>
<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.cctv.search.js"></script> --%>
<div class="searchWrapper">

    <p class="searchTitle">FNMS</p>
</div>