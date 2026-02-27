"use strict";

var validation = null;
var createMgrSeq = null;
var addImgList = new Array();

$(document).ready(function(){

	var renameTocctvIndexText = function(){
		$("#cctvSelectWrap").find(".idxB").each(function(i, e){
			$(this).text(i + 1);
		});
	};

	/**
	 * 데이터를 검증합니다.
	 */
	validation = function(param){
		var isBreak = false;

		for(var key in param){
			if(_common.utils.isNullAndEmpty(param[key])){
				$("#addBtn, #editBtn").attr("type", "submit");

				isBreak = true;
				break;
			}
		}

		if(!isBreak){
			if($(".selectCctvInfo").length == 0){
				return true;
			}else{
				$("#addBtn, #editBtn").attr("type", "button");
			}
		}

		return isBreak;
	}

	/**
	 * 신청번호를 생성합니다.
	 */
	createMgrSeq = function(){
		var baseTimestamp = 1000 * 60 * 60 * 24 * 365 * 40;
		var currentTimeMillis = new Date().getTime();
		var SerialNumGenPrev = currentTimeMillis - baseTimestamp;

		return SerialNumGenPrev;
	};

	if($("#mgrSeq").val() == "") $("#mgrSeq").val(createMgrSeq());

	/**
	 * 공문 업로드 이벤트 입니다.
	 */
	$("#uploadImg").on("change", function(){
		var val = $(this).val();
		if(val != ""){
			_common.formSubmit("/tvius/addDocFile.json", $("#regForm"), function(json){
				if(json.exception){
					alert(json.exception);
					$("#uploadImg").val("");
					$("#docFileNm").val("");
					$("#docFilePath").val("");
				}else if(json.realNm != null && json.uploadNm != null){
					if(json.uploadNm.length >7){
						$("#fileNm").text(json.uploadNm.substring(0,6)+'...');
					}else{
						$("#fileNm").text(json.uploadNm);
					}
					$("#docFileNm").val(json.uploadNm);
					$("#docFilePath").val(json.realNm);
				}
			});
		}
	});

	/**
	 * 이미지 추가 이벤트 입니다.
	 */
	$("#addImg").change(function(){
		var $this = $(this);

		try{
			var inputFile = $(this)[0];
			for(var i=0; i<inputFile.files.length; i++){
				var reader = new FileReader();
				reader.onload = (function(file){
					return function(e) {
						addImgList.push(file);

						var imgNm = file.name;
						var imgDesc = prompt("이미지의 설명을 입력하세요.\n\n미입력시 파일명으로 대체합니다.");
						if(_common.utils.isNullAndEmpty(imgDesc)) imgDesc = imgNm;

						var $idxB  = $("<b class='idxB'>").text($(".selectCctvInfo").length + 1);
						var $marqu = $("<marquee>").text(imgDesc);
						var $title = $("<button type='button' class='selectCctvInfo ui-btn ui-icon-delete ui-btn-icon-right' data-role='button'></button>").attr({ "imgNm" : imgNm, "imgDesc" : imgDesc }).height("32px").append($idxB).append($marqu);

						var $thumb = $("<img>").attr("src", e.target.result).css("max-width", $(document).width() - 45);

						var $wrap = $("<fieldset class='ui-grid-a tCenter'></fieldset>");
						$wrap.append($title).append($thumb);

						$title.click(function(){
							if(confirm($(this).attr("imgNm") + "\n\n이미지를 목록에서 제거하시겠습니까?")){
								var idx = $(".selectCctvInfo").index($(this));
								addImgList.splice(idx, 1);

								$(this).parent().parent().remove();
								renameTocctvIndexText();
							}
						});

						$thumb.click(function(){
							var nowName = $(this).parent().find(".selectCctvInfo").attr("imgDesc");
							var reName = prompt("이미지 설명을 입력하세요.\n\n현재 설명 : " + $(this).parent().find(".selectCctvInfo").attr("imgDesc"));
							if(!_common.utils.isNullAndEmpty(reName) && (reName !== nowName)){
								$(this).parent().find(".selectCctvInfo").find("marquee").text(reName);
								$(this).parent().find(".selectCctvInfo").attr("imgDesc", reName);
							}
						});

						var $li = $("<li>").addClass("ui-li-static ui-body-inherit ui-last-child").append($wrap);

						$("#cctvSelectWrap").append($li);

						$(".ui-page").trigger("create");

						renameTocctvIndexText();
			        };
				})(inputFile.files[i]);
				reader.readAsDataURL(inputFile.files[i]);
			}
		}catch(e){

		}
	});

	var validPassword = function(userId, userPwd){
		var isValid = false;

		_common.callAjax("/user/checkPassword.json", { "userId" : userId, "userPwd" : userPwd }, function(json){
			if(json.result !== null){
				if(_common.utils.isNullAndEmpty(json.result.userId)){
					isValid = true;
				}
			}
		}, false);

		return isValid;
	}

	/**
	 * 반출 신청 이벤트 입니다.
	 */
	$("#addBtn").click(function(){
		var param = _common.utils.collectSendData("#regTable");
		delete param["p"];
		delete param["undefined"];

		if(!validation(param)){

			var isValidUser = true;
			_common.callAjax("/tvius/mobile/getUserInfo.json", { "userId" : $("#reqstId").val() }, function(json){
				if(_common.utils.isNullAndEmpty(json.result)){
					isValidUser = false;
					alert("입력하신 계정 정보가 존재하지 않습니다.");
					$("#reqstId").focus();
				}else{
					$("#userNm").val(json.result.userNm);
					$("#birthDay").val(json.result.birthDay);
					$("#mobileNum").val(json.result.mobileNum);
					$("#departNm").attr("depart", json.result.departNm).val(json.result.departNm);
				}
			}, false);
			if(!isValidUser) return false;

			window.scrollTo(0, 0);
//			$("#regForm").css("display","none");
			$("#securityPopup").popup("open");


			$("#rqstSendBtn").off("click").click(function(){

				if(!$("#agreeSecurity").is(":checked")){
					alert("서약 내용에 동의가 필요합니다.");
					$("#agreeSecurity").focus();
					return false;
				}

				if(_common.utils.isNullAndEmpty($("#userPwd").val())){
					alert("본인 확인을 위하여 암호를 입력해 주세요.");
					$("#userPwd").focus();
					return false;
				}

				if(_common.utils.isNullAndEmpty($("#departNm").val())){
					alert("소속 및 부서를 입력해 주세요.");
					$("#departNm").focus();
					return false;
				}

				if(!validPassword($("#reqstId").val(), $("#userPwd").val())){
					//alert("계정 인증에 실패하여 신청할 수 없습니다.");
					return false;
				}

				if(confirm("이미지 반출을 신청하시겠습니까?")){

					if($("#departNm").val() !== $("#departNm").attr("depart")){
						_common.callAjax("/tvius/mobile/editUserDepart.json", { "departNm" : $("#departNm").val() }, function(){});
					}

					var imgMgrSeqList = new Array();
					var imgUploadSuccess = false;

					$(".selectCctvInfo").each(function(i, e){
						var imgDesc = $(this).attr("imgDesc");
						var imgNm = $(this).attr("imgNm");

						var param = new FormData();
						param.append("p", "image\\");
						param.append("uploadImg", addImgList[i]);

						$.ajax({
							type: "POST",
							url: "../addFileOfImgRqst.json",
							data: param,
							async: false,
							processData: false,
							contentType: false,
							success: function(json){
								if(json.result){
									imgUploadSuccess = true;

									var imgUploadParam = {};
									imgUploadParam["imgNm"] = imgNm;
									imgUploadParam["regId"] = param["reqstId"];
									imgUploadParam["imgDesc"] = imgDesc;
									imgUploadParam["imgPath"] = json.realNm;

									_common.callAjax("/tvius/addCrmsImg.json", imgUploadParam, function(_json){
										if(_json.result){
											imgUploadSuccess = true;
											imgMgrSeqList.push(_json.crmsImageVo.mgrSeq);
										}else{
											imgUploadSuccess = false;
											return false;
										}
									}, false);

								}else{
									imgUploadSuccess = false;
									return false;
								}
							}
						});
					});

					if(!imgUploadSuccess){

						alert("이미지 업로드를 실패하였습니다.");
						return false;

					}else{

						if(imgUploadSuccess){
							var isEnd = false;
							_common.callAjax("/tvius/addCrmsImgRqst.json", param, function(json) {
								if(json.result){
									for(var i=0; i<imgMgrSeqList.length; i++){
										_common.callAjax("/tvius/addCrmsImgJoin.json", { "rqstMgrSeq" : param.mgrSeq, "imgMgrSeq" : imgMgrSeqList[i] }, function(json) {
											if(json.result){
												isEnd = true;
											}else{
												isEnd = false;
											}
										}, false);
									}
								}
							}, false);

							if(isEnd){
								alert("이미지 반출 신청이 완료되었습니다.");
								$("#home").click();
							}
						}
					}

				}

			});
		}
	});

	/**
	 * 메인으로 이동 이벤트 입니다.
	 */
	$("#home").click(function(){
		location.href = $(this).attr("url");
	});

	/**
	 * 브라우저 리사이즈 이벤트 입니다.
	 */
	$(window).resize(function(){

	});

});