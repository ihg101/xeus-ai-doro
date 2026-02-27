/**
 * jQuery Time Picker
 *
 * DatePicker 사용 후, 시간까지 입력받기 위해 제작되었습니다.
 * CSS 부분 중 jQuery UI에서 배포한 이미지와 관련된 의존성이 존재합니다.
 *
 * 필수) _CALLBACK - 콜백함수
 *
 * @author	이주영
 * @since	2015-11-25
 * @version 0.1
 */
$.fn.timepicker = function(_CALLBACK){

	if(!_common.utils.validObject(_CALLBACK, "function")){
		console.warn("필수) 콜백함수 누락");
		return false;
	}

	var $_this = this;
	var top = this.offset().top;
	var left = this.offset().left;

	$("body").find(".gmx-timepicker").remove();

	var tpk = "<div class='gmx-timepicker gmx-corner'>";

		tpk += "<div class='gmx-timepicker-header gmx-corner'>시간 선택</div>";

		tpk += "<div class='gmx-timepicker-body'>";
			tpk += "<select class='gmx-timepicker-hour'>";
			for(var i=0; i<24; i++){
				if(i < 10){
					tpk += "<option value='0" + i + "'>0" + i + " 시</option>";
				}else{
					tpk += "<option value='" + i + "'>" + i + " 시</option>";
				}
			}
			tpk += "</select>";

			tpk += "<select class='gmx-timepicker-min'>";
			for(var i=0; i<60; i++){
				if(i < 10){
					tpk += "<option value='0" + i + "'>0" + i + " 분</option>";
				}else{
					tpk += "<option value='" + i + "'>" + i + " 분</option>";
				}
			}
			tpk += "</select>";

			tpk += "<select class='gmx-timepicker-sec'>";
			for(var i=0; i<60; i++){
				if(i < 10){
					tpk += "<option value='0" + i + "'>0" + i + " 초</option>";
				}else{
					tpk += "<option value='" + i + "'>" + i + " 초</option>";
				}
			}
			tpk += "</select>";

			tpk += "<br><button class='gmx-timepicker-btn gmx-corner'>확인</button>";
		tpk += "</div>";

	tpk += "</div>";

	$("body").append(tpk);

	$(".gmx-timepicker").offset({
		top : top,
		left : left
	});

	$(".gmx-timepicker-btn").on("click", function(){
		var hour = $(".gmx-timepicker-hour").val();
		var min = $(".gmx-timepicker-min").val();
		var sec = $(".gmx-timepicker-sec").val();

		if(!_common.utils.validNaN(hour) || !_common.utils.validNaN(min) || !_common.utils.validNaN(sec)){
			alert("시간 값은 임의로 넣을 수 없습니다.");
			return false;
		}else{
			$_this.val($_this.val() + "" + hour + "" + min + "" + sec);
			_CALLBACK();
			$(".gmx-timepicker").remove();
		}
	});

};