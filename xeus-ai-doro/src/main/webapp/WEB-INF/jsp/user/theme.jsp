<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp"%>
<script>
$(".themeBtn").click(function(){
	var $chk = $("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACs0lEQVR4Xu3aO3MTMRDA8ZVMhzsgFSVtaGmdFNi4TGIaYAj0FBT0/ghQ0OVBqJjEoeAVGiYJDQmfhYpHw8xpGTnxjXHurZW0Ol9qj3z/3+1dzrIFzPmfmPN+aACaCZhzgeYSqOMAdHa7N7Alny1E7Sd7d/f+ZjXWbgJ0vBDyECRcVwreLWB7kIVQK4Dp+MlZR4D316L2WhpCbQCS4osg1AIgK36CIBA+XFHt1dlJCB6gSHwWQtAAZeLTEIIFqBKfhBAkgEl8/EygxMereHklOACS+HMFAfAmKADKeFDql2yJbjAANuK/rHz+FgSArXh9JbAHsBnPHsB2PGsAF/FsAVzFswRwGc8OwHU8KwAf8YUBlkb9W4drn05t7R/6ii8EsDS68xgQNhDgxdHg4Ck1gs/4XIDlt/1HGOEmyLMHJlTwnBLBd3wmgI6PMNqQIOX0WadC4BCfCpAWH28yGk4Cl/hEgM5+bx0BN2fP/Oy1X3USOMVfACgaX3USuMX/B9AZ9R6iwK28M191EjjGxwBV44tOAtf4MYBpfB4C5/gxwPJ+fxsB1ykecGZvjNzjxwDD4VAeL568AhAPKBFCiI/vAdQISsCWjOC2/oraGPV891ZvYBqvlbBAvCdIjUBysJbjLzwHsEJwEJ/4JMgCwVF86mcBjfD15vcdRLxPMsplFnEYn/lp0AuC4/jc/QCnCB7icwH0C5wgeIovBGAdwWN8YQBrCJ7jSwFMEI4XT18DwL0yN/bE1zKILw1AhsAkvhKAMQKj+MoAlRGYxRsBlEZgGG8MoBcY7A5aP1q/dzJvjEzjSQByERjHkwGkISiEn5ck9mxtZhj/K6b+kdT05aDjhYDu0erBCcWB2lqD/FdiZwh/XgLCts2v1KlAyAGoDszVOg2AK2mu79NMANcz4+q45n4C/gEPNDoK1iHb1QAAAABJRU5ErkJggg=='>");
		$chk.css("margin-top", "20px").hide();

	$(".themeBtn").removeClass("themeActive").html("");
	$(this).addClass("themeActive").append($chk);

	$chk.show().effect("bounce", 500);

	if(localStorage) localStorage["SystemTheme"] = $(this).attr("c");

	if("_SET_THEME" in window) _SET_THEME();


});

if(localStorage && ("SystemTheme" in localStorage)){
	$(".themeBtn[c=" + localStorage["SystemTheme"] + "]").click();
}else{
	$(".themeBtn[c=dark]").click();
}
</script>
<table>
	<tr>
		<th><div class="themeBtn pointer themeActive" style="width: 100px; height: 100px; margin: 0 auto; border-radius: 25%; background: #333333; text-align: center;" c="dark"></div></th>
		<th><div class="themeBtn pointer" style="width: 100px; height: 100px; margin: 0 auto; border-radius: 25%; background: #efefef; text-align: center;" c="light"></div></th>
		<th><div class="themeBtn pointer" style="width: 100px; height: 100px; margin: 0 auto; border-radius: 25%; background: #0078d4; text-align: center;" c="blue"></div></th>
	</tr>
	<tr>
		<th>다크 모드</th>
		<th>라이트 모드</th>
		<th>블루 모드</th>
	</tr>
</table>