<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
$("#focusSelect").click(function(){
	Public.CCTV.Focus.Start();
});

</script>
<div class="searchWrapper">

    <p class="searchTitle">CCTV 활성화</p>
    <table>
        <tr>
            <!-- <th>집중감시를 수행할 CCTV를 CCTV 목록창에 드래그&드롭 하여 집중감시 CCTV를 활성화 합니다.</th> -->
            <th style="height: 45px;">
            	CCTV를 우측패널에 드래그&드롭하여 집중감시 CCTV를 활성화 합니다.
           	</th>
        </tr>
    </table>
    <div class="btnDiv">
		<button class="blackBtn_Fill" id="focusSelect">집중감시 지점 선택 하기</button><!-- whiteBtn -->
    </div>
</div>