/**
 * 장비관리(NMS) 메뉴의 상태 모니터링 관련 이벤트 입니다.
 */
(function(){

	Public.NMS.Monitoring.getList();

	/* 자동 갱신버튼 이벤트 입니다. */
	$(".contentWrapper").find("#intervalBtn").click(function(){
		$("#intervalStopBtn").show();
		$(this).hide();
		var seconds = Number($(".contentWrapper").find("#scdVal").val());
		Public.NMS.Monitoring.Start(seconds);
	});

	/* 자동 갱신 취소버튼 이벤트 입니다. */
	$(".contentWrapper").find("#intervalStopBtn").click(function(){
		$("#intervalBtn").show();
		$(this).hide();
		Public.StopEvent();
	});

})();