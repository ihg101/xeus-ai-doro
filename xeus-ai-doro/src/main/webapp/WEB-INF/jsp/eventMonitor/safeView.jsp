<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.eventmonitor.service.UserTraceVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp" %>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* C63 // 이벤트 종류 */
    HashMap<String, String> chkEventTyp = cde.convertCodeGrpToAllCde("C63");
    Set<String> chkEventTypKey = new TreeSet<String>(chkEventTyp.keySet());
    Iterator<String> chkEventTypItr = chkEventTypKey.iterator();

    /* C64 // 이벤트 종료사유 */
    HashMap<String, String> chkCloseTyp = cde.convertCodeGrpToAllCde("C64");
    Set<String> chkCloseTypKey = new TreeSet<String>(chkCloseTyp.keySet());
    Iterator<String> chkCloseTypItr = chkCloseTypKey.iterator();

    /* C65 // 이벤트 처리상태 */
    HashMap<String, String> chkStateTyp = cde.convertCodeGrpToAllCde("C65");
    Set<String> chkStateTypKey = new TreeSet<String>(chkStateTyp.keySet());
    Iterator<String> chkStateTypItr = chkStateTypKey.iterator();

    /* C67 // 이벤트 처리상태 */
    HashMap<String, String> chkTraceStateCd = cde.convertCodeGrpToAllCde("C67");
    Set<String> chkTraceStateCdKey = new TreeSet<String>(chkTraceStateCd.keySet());
    Iterator<String> chkTraceStateCdItr = chkTraceStateCdKey.iterator();

    ArrayList<UserTraceVo> user = (ArrayList<UserTraceVo>)request.getAttribute("user");

%>
<div class="searchWrapper">

    <p class="searchTitle">안심귀가 사용자 목록</p>
    <table>
        <tr>
            <th>아이디</th>
            <th>성명</th>
            <th>상태</th>
        </tr>
        <%
        if(user.size() == 0){
        %>
        <tr>
            <td colspan="3" class="tCenter">
                데이터가 존재하지 않습니다.
            </td>
        </tr>
        <%
        } else {
            for( int i=0; i<user.size(); i++){
        %>
        <tr evtno="<%= user.get(i).getUserId() %>">
            <td><%= DateUtil.formatDate( user.get(i).getUserNm() ) %></td>
            <td><%= StrUtil.chkNull( user.get(i).getStateCd() ) %></td>
            <td>코드표</td>
        </tr>

        <%
            }
        }
        %>
    </table>

    <p class="searchTitle">안심귀가 상세정보</p>
    <div>
        <span>종료사유</span>
        <select>
            <option>선택</option>
        </select>
        <button class="whiteBtn">상황종료</button>
        <span>조치내용</span>
        <input type="text">
    </div>
    <table>
        <tr>
            <th>성명</th>
            <td>홍길동</td>
        </tr>
        <tr>
            <th>연락처</th>
            <td>010-1234-5678</td>
        </tr>
        <tr>
            <th>성별</th>
            <td>남</td>
        </tr>
        <tr>
            <th>나이</th>
            <td>99세</td>
        </tr>
        <tr>
            <th>보호자명</th>
            <td>홍길동2</td>
        </tr>
        <tr>
            <th>보호자 연락처</th>
            <td>010-9876-5432</td>
        </tr>
        <tr>
            <th>최근위치</th>
            <td>127.001234 | 37.54687</td>
        </tr>
        <tr>
            <th>상세주소</th>
            <td>강원도 춘천시 박사로 882</td>
        </tr>
        <!-- 171212 -->
        <!-- <tr>
            <td colspan="2"><button>투망모니터링</button></td>
        </tr> -->
    </table>
    <div class="btnDiv">
        <tr>
            <td colspan="2"><button class="whiteBtn">투망모니터링</button></td>
        </tr>
    </div>

    <table>
        <tr>
            <th colspan="2">이동경로</th>
            <th>새로고침</th>
        </tr>
        <tr>
            <th>순번</th>
            <th>시간</th>
            <th>경위도</th>
        </tr>
        <tr>
            <td>1</td>
            <td>2017-08-24 00:00:00</td>
            <td>127.00123 | 37.5432</td>
        </tr>
        <tr>
            <td>2</td>
            <td>2017-08-24 00:00:00</td>
            <td>127.00123 | 37.5432</td>
        </tr>
        <tr>
            <td>3</td>
            <td>2017-08-24 00:00:00</td>
            <td>127.00123 | 37.5432</td>
        </tr>
        <tr>
            <td>4</td>
            <td>2017-08-24 00:00:00</td>
            <td>127.00123 | 37.5432</td>
        </tr>
        <tr>
            <td>5</td>
            <td>2017-08-24 00:00:00</td>
            <td>127.00123 | 37.5432</td>
        </tr>
    </table>

</div>