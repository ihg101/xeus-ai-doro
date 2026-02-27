<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="searchBox"  align="center">
    <button class="subTab" id="tmTab" active="active">TM <-> 경위도</button><button class="subTab" id="lnglatTab">경위도 <-> TM</button>

    <div id="searchWrap">
	    <table id="tmUI">
	        <tr>
	            <td>투영원점</td>
	            <td>
	                <select id="epsg" class="sendData">
						<option value="EPSG:5181" selected="selected">중부(20만, 50만)</option>
						<option value="EPSG:5180">서부(20만, 50만)</option>
						<option value="EPSG:5183">동부(20만, 50만)</option>
						<option value="EPSG:5184">동해(20만, 50만)</option>
						<option value="EPSG:5186">중부(20만, 60만)</option>
						<option value="EPSG:5185">서부(20만, 60만)</option>
						<option value="EPSG:5187">동부(20만, 60만)</option>
						<option value="EPSG:5188">동해(20만, 60만)</option>
<!--                         grs80 -->
	                </select>
	            </td>
	        </tr>
	        <tr>
	            <td>X(남북)</td>
	            <td><input type="text" id="tmX" class="sendData keynext" placeholder="X"></td>
	        </tr>
	        <tr>
	            <td>Y(동서)</td>
	            <td><input type="text" id="tmY" class="sendData keyup" placeholder="Y" for="#tmSearch"></td>
	        </tr>
	        <tr>
	            <td colspan="2" class="lastTd"><button id="tmSearch" class="searchBtn">검색</button></td>
	        </tr>
	    </table>

	    <table id="lnglatUI" class="hidden">
	        <tr>
	            <td>경도</td>
	            <td>
	                <input type="text" id="lng" class="sendData keynext" placeholder="도">
	            </td>
	        </tr>
	        <tr>
	            <td>위도</td>
	            <td>
	                <input type="text" id="lat" class="sendData keyup" placeholder="도" for="#lnglatSearch">
	            </td>
	        </tr>
	        <tr>
	            <td colspan="2" class="lastTd"><button id="lnglatSearch" class="searchBtn">검색</button></td>
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