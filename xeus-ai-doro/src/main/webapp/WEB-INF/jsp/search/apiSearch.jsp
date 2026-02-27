<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="searchBox"  align="center">
    <div id="searchWrap">
	    <table>
	        <tr>
	            <td>검색타입</td>
	            <td>
	                <input type="radio" name="radioGroup" id="srchType1" value="local" checked="checked">
	                <label for="srchType1">키워드</label>
	                <input type="radio" name="radioGroup" id="srchType2" value="addr">
	                <label for="srchType2">주소</label>
	            </td>
	        </tr>
	        <tr>
	            <td>검색어</td>
	            <td><input type="text" id="searchStr" class="keyup" placeholder="검색어" for="#apiSearch"></td>
	        </tr>
	        <tr>
	            <td colspan="2" class="lastTd"><button id="apiSearch" class="searchBtn">검색</button></td>
	        </tr>
	    </table>
    </div>
</div>
<div id="srchHeader">
<!--     <img src="./img/map/icon_bullet.png"> -->
    <b>검색결과</b>
</div>
<div id="srchResult" align="center">

</div>