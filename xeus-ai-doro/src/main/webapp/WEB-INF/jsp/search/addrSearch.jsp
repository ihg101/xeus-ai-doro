<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="java.util.ArrayList"%>
<%
ArrayList<EmdVo> emdList = (ArrayList<EmdVo>) request.getAttribute("emdList");
ArrayList<LiVo> liList = (ArrayList<LiVo>) request.getAttribute("liList");
ArrayList<DoroVo> rnList = (ArrayList<DoroVo>) request.getAttribute("rnList");
%>
<div id="searchBox" align="center">
    <!-- <button class="subTab" id="jibunTab" active="active">지번주소</button><button class="subTab" id="doroTab">도로명주소</button> -->

    <div id="searchWrap">
	    <table id="jibunUI">
	        <tr>
	            <td>
	               <select id="searchMode">
				        <option value="1">지번</option>
				        <option value="2">새주소</option>
				        <option value="3">좌표</option>
				    </select>
	            </td>
	            <td>읍면동</td>
	            <td>
	                <select id="emdCd" class="sendData">
                    <option value="-99999">선택하세요.</option>
                    <%
                    for(int i=0; i<emdList.size(); i++){
                        String emdCd = emdList.get(i).getEmdCd().substring(5);
                    %>
                    <option value="<%= emdCd %>"><%= emdList.get(i).getEmdKorNm() %></option>
                    <%
                    }
                    %>
	                </select>
	            </td>
                <td>리</td>
                <td>
                    <select id="liCd" class="sendData" disabled="disabled">
                        <option value="-99999">선택하세요.</option>
                        <%
                        for(int i=0; i<liList.size(); i++){
                            String liCd = liList.get(i).getLiCd().substring(8);
                            String emdCd = liList.get(i).getLiCd().substring(5,8);
                        %>
                        <option value="<%= liCd %>" emd = "<%=emdCd%>" bjdCd="<%=liList.get(i).getLiCd()%>"><%= liList.get(i).getLiKorNm() %></option>
                        <%
                        }
                        %>
                    </select>
                </td>
	            <td>
	                <input type="checkbox" id="san" name="san" class="sendData">
	                <label for="san">산</label>
	            </td>
	            <td>
	                <input type="text" id="bon" class="sendData keyup" placeholder="본번" for="#jibunSearch"> -
	                <input type="text" id="bu" class="sendData keyup" placeholder="부번" for="#jibunSearch">
                </td>
	            <td colspan="2" class="lastTd"><button id="jibunSearch" class="searchBtn">검색</button></td>
	        </tr>
	    </table>

	    <table id="doroUI" class="hidden">
	        <tr>
	            <td>도로명</td>
	            <td>
	                <select id="rnCd" class="sendData">
                    <%
                    for(int i=0; i<rnList.size(); i++){
                        String rnCd = rnList.get(i).getRnCd();
                    %>
                        <option value="<%= rnCd %>"><%= rnList.get(i).getRn() %></option>
                    <%
                    }
                    %>
	                </select>
	            </td>
	        </tr>
	        <tr>
	            <td>건물번호</td>
	            <td>
	               <input type="text" id="bon" class="sendData keyup" placeholder="본번" for="#doroSearch"> -
	               <input type="text" id="bu" class="sendData keyup" placeholder="부번" for="#doroSearch">
               </td>
	        </tr>
	        <tr>
	            <td colspan="2" class="lastTd"><button id="doroSearch" class="searchBtn">검색</button></td>
	        </tr>
	    </table>
    </div>
</div>
<div id="srchHeader">
    <b>검색결과</b>
</div>
<div id="srchResult" align="center">

</div>