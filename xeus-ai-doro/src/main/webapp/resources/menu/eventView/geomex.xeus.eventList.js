(function(GMXMAP){
	if(GMXMAP != null && GMXMAP instanceof ol.Map){
		
		$("#btnEvtSet").on('click', function(){
			$("#setPopup").dialog({
				title : "이벤트 수신설정",
			    width: 240,
				position: {
					my: "right+260 top+20",
					at: "right top",
					of: $("#contentWrap")
				},open : function(){
					if(_SITE_NAME_ !== "태백시"){
						var silceLi = $(".setting_list").children().slice(0,4);
						$(".setting_list").children().remove();
						$(".setting_list").append(silceLi);
					}
					loadSettings();
				}
			});
		})
		
		$(".btn_detail").on('click', function(){
			$("#detailPopup").dialog("open");
		})

		// 이벤트 리스트 버튼 클릭 시 다이얼로그 제거
	    $("#btn-event-list-view").on('click', function() {
	    	$("#setPopup").dialog("destroy").remove();
	    });

		// 로컬 스토리지에 저장된 설정값을 불러와 각 체크박스에 반영하고, 저장된 값이 없으면 기본값을 설정
		function loadSettings() {
			var defaultSettings = { '001': "true", '002': "true", '004': "true", '005': "true", '003': "true" };
			if(_SITE_NAME_ === "태백시"){
				defaultSettings  = { '001': "true", '002': "true", '004': "true", '005': "true", '003': "true" , '006': "true" , '007': "true" };
			}

		    Object.entries(defaultSettings).forEach(([key, defaultValue], index) => {
		        var value = localStorage.getItem(key);
		        if (value === null) {
		            value = defaultValue;
		            localStorage.setItem(key, value);
		        }
		        $('#set' + (index + 1)).prop('checked', value === 'true');
		    });
		}

		// 체크박스 상태 변경 시 로컬 스토리지에 저장
		// 순서주의 : 수신설정 메뉴 순서는 포>낙>굴>크>콘, 코드는 1>2>4>5>3
		$(document).on('change', '#setPopup input[type="checkbox"]', function() {
			var keyMap = { set1: '001', set2: '002', set3: '004', set4: '005', set5: '003' };
			if(_SITE_NAME_ === "태백시"){
				keyMap = { set1: '001', set2: '002', set3: '004', set4: '005', set5: '003', set6: '006', set7: '007' };
			}
			var id = $(this).attr('id');
			var key = keyMap[id];
		    if (key) {
		    	localStorage.setItem(key, $(this).is(':checked') ? "true" : "false");
		    }
		    if(window.WIDGET) WIDGET.getPastEventListWidget();
		});

		var $ROOT = $(".contentWrapper");

		if(window.WIDGET) WIDGET.getPastEventListWidget();

		$('#contentWrap').scrollTop(0);

		if(!("evetPin" in window)) window.evetPin = false;

		if(("localStorage" in window) && ("evetPin" in localStorage)){
			if(localStorage["evetPin"] === "true"){
				window.evetPin = true;
			}else{
				window.evetPin = false;
			}
		}

		if(window.evetPin){
			$("#evetPinBtn").attr("active", "active").text("이벤트 수신 시작");
			$ROOT.find("#evetPinTxt").text("수신 시작을 하시면 지도가 자동으로 이동합니다.");
		}else{
			$("#evetPinBtn").attr("active", "").text("이벤트 수신 정지");
			$ROOT.find("#evetPinTxt").text("수신 정지를 하시면 지도가 이동하지 않습니다.");
		}

		if($("#evtTable").find("tbody").find("tr").length == 0){
			$("#widget-point").find("#dis").hide();
		}else{
			$("#widget-point").find("#dis").show();
		}

		$("#widget-point").find(".pointBtn").click(function(){
			if($(this).attr("active") == "active"){
				$("#widget-point").find(".pointBtn").attr("active", "");
			}else{
				$("#widget-point").find(".pointBtn").attr("active", "");
				$(this).attr("active", "active");
			}
		});

		$ROOT.find("#evetPinBtn").click(function(){
			if($(this).attr("active") == "active"){
				window.evetPin = false;
				$(this).attr("active", "").text("이벤트 수신 정지");
				$ROOT.find("#evetPinTxt").text("수신 정지를 하시면 지도가 이동하지 않습니다.");
			}else{
				window.evetPin = true;
				$(this).attr("active", "active").text("이벤트 수신 시작");
				$ROOT.find("#evetPinTxt").text("수신 시작을 하시면 지도가 자동으로 이동합니다.");

				if($("#widget-point").find(".pointBtn").eq(0).attr("active") == "active") $("#widget-point").find(".pointBtn").eq(0).attr("active", "");
				if($("#widget-point").find(".pointBtn").eq(1).attr("active") == "active") $("#widget-point").find(".pointBtn").eq(1).attr("active", "");
			}

			if(("localStorage" in window)) localStorage["evetPin"] = window.evetPin;
		});
		
		$('#btnEvtLayer').click(function(){
			
			
			var isActive = $('#btnEvtLayer').hasClass('active');
			
			GMXMAP.getLayer(AIDORO.LAYER_ID).setVisible(!isActive);
			$(this).toggleClass('active', !isActive);
		});
		
	

	}
})(GMXMAP);
