<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ include file="../../common.jsp" %>
<%
SiteVo vo = (SiteVo) request.getAttribute("result");
ArrayList<ImageVo> img = (ArrayList<ImageVo>) request.getAttribute("img");
%>
<script>
/* 이미지 새탭으로 보기 이벤트 입니다. */
$("#imgWrapper").find(".imgs").click(function(){
    var param = {"mgrSeq" : $(this).attr("k")};
    _common.postForm.open("/image/getImage.do", param);
});

/* 이미지 삭제 이벤트 입니다. */
$("#imgWrapper").find(".close").click(function(){
    var $span = $(this).parent();
    var param = {"mgrSeq" : $(this).attr("k")};
    confirm("이미지를 삭제하시겠습니까?", function(){
    	_common.callAjax("/image/del.json", param, function(json){
            if(json.result){
                $span.remove();
            }
        });
    });
});

/* 사진 추가 버튼 이벤트 입니다. */
$("#bottomWrapper").find("#uploadBtn").click(function(){
    $("#hiddenForm").find("#uploadImg").click();
});

/* 상위 "사진 추가" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$("#hiddenForm").find("#uploadImg").on("change", function(){
    var nm = $(this).val();
    if(nm != ""){
        confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
        	$("#hiddenForm").find("#i").val($(".imgBox").length + 1);
            _common.formSubmit("/image/add.json", $("#hiddenForm"), function(json){
                if(json.result){
                    var v = "<%= vo.getMgrNo() %>";

                    $(".bottomTab").find("button.tab").eq(0).click();
                }
            });
        }, function(){
        	$("#hiddenForm").find("#uploadImg").val("");
        });
    }
});
</script>
<table>
    <tr class="tCenter" height="40%">
        <td id="imgWrapper">
            <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                <input type="text" name="k" id="k" class="hidden" value="<%= vo.getMgrNo() %>">
                <input type="text" name="i" id="i" class="hidden" value="0">
                <!-- <input type="text" name="p" id="p" class="hidden" value="\upload\nms\"> -->
                <input type="text" name="p" id="p" class="hidden" value="\nms\">
                <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept="image/gif, image/jpeg, image/png">
            </form>
            <!-- <p>참고) 사진 삭제, 추가시 해당 점검에 바로 저장됩니다.</p> -->
<% if(img == null){ %>
            <p style="padding: 100px 0px;"><b>이미지가 존재하지 않습니다.</b></p>
<% }else{ %>
<% for(int i=0; i<img.size(); i++){ %>
            <span class="imgBox">
                <img class="imgs" alt="<%= img.get(i).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= img.get(i).getMgrSeq() %>" k="<%= img.get(i).getMgrSeq() %>">
                <img class="close" src="../res/img/close.png" k="<%= img.get(i).getMgrSeq() %>">
            </span>
<% } %>
<% } %>
        </td>
    </tr>
    <tr class="tCenter">
        <td>
            <button class="blueBtn" id="uploadBtn">사진 추가</button>
        </td>
    </tr>
</table>