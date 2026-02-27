/**
 * Directory Listing 기능을 지원합니다.
 *
 * @author 이주영
 */
(function(){
	var $ul = $("#sortable");
	$ul.sortable().sortable("disable");
	$ul.disableSelection();

	/**
	 * Submit 처리합니다.
	 */
	var submit = function(_PARAMETERS){
		_URL = "./";

		$("#postForm").remove();

		var str = "";
		str += "<form action='" + _URL + "' method='POST' name='postForm' id='postForm' data-ajax='false'>";
		for(var prop in _PARAMETERS){
			str += "<input type='hidden' name='" + prop + "' value='" + _PARAMETERS[prop] + "'>";
		}
		str += "</form>";

		$(str).appendTo("body").submit().remove();
	}

	/**
	 * 현재 사용되지 않습니다.
	 *
	 * 새창에 Post Submit 처리합니다.
	 *
	 * @Deprecated
	 */
	var openSubmit = function(_URL, _PARAMETERS){
		$("#postForm").remove();

		var str = "";
		str += "<form name='postForm' id='postForm'>";

		for(var prop in _PARAMETERS){
			str += "<input type='hidden' name='" + prop + "' value='" + _PARAMETERS[prop] + "'>";
		}

		str += "</form>";

		$("body").append(str);

		var _window = window.open("", "newWindow");
		var _form = document.getElementById("postForm");
		_form.action = _URL;
		_form.target = "newWindow";
		_form.method = "POST";
		_form.submit();
	}


	/**
	 * 선택한 폴더의 부모 중 왼쪽 리스트에 표출이 안된 폴더 새롭게 생성
	 */
	var findAndCreateNewLi = function(directorys){
		var str = "";
		var $parentLi;
		for(var i=0; i<directorys.length; i++){
			if(i == 0){
				continue;
			}else{
				str+="/"+directorys[i];
			}

			var doCreate = true;

			$("#rootPath").find("li").each(function(){
				if($(this).find("label").attr("p") === str.substring(1)){
					doCreate=false;
					$parentLi=$(this);
				}
			});
			if(doCreate){
				var $li =createNewLi(directorys[i], str.substring(1), i);
				$parentLi.after($li);

				$parentLi=$li;
			}
		}
	}


	var createNewLi = function(title, p, depth){
		var $li = $('<li class="innerPath depth_'+depth+'">');
		$li.append('<img class="smallFolder"><label class="psText" title="'+title+'" p="'+p+'">'+title+'</label>');

		return $li;
	}

	/**
	 * 현재 디렉토리를 이용하여 경로 표시 및 이벤트를 바인딩 합니다.
	 */

	var directorys = null;
	if("nowPath" in window) directorys = nowPath.split("/");
	if(directorys != null){
		if(directorys.length === 1){
			$(".returnItem").css("cursor", "no-drop").children().css("cursor", "no-drop");
			$("#rootPath").find("li").eq(0).css("background", "#e0e0e0").css("font-weight", "bold");
		}else if(directorys.length > 1){

			//새로은 li 생성
			findAndCreateNewLi(directorys);

			$("#rootPath").find("li").each(function(){
				if($(this).find("label").attr("p") === nowPath.substring(1)){
					$(this).css("background", "#e0e0e0").css("font-weight", "bold");
				}
			});

			for(var i=0; i<directorys.length; i++){
				var $span = $("<span>").text(" > ");
				var $b = $("<b>").addClass("moveDir").text(directorys[i]);
				if(i > 0){
					if(i == 1){
						$(".nowPath").append($b);
					}else{
						$(".nowPath").append($span).append($b);
					}
				}
			}

			$(".nowPath").find(".moveDir").click(function(){
				var idx = $(".nowPath").find(".moveDir").index($(this));

				var subPath = "";
				$(".nowPath").find(".moveDir").each(function(i, e){
					if(i <= idx) subPath += "/" + $(this).text();
				});

				submit({ "subPath" : subPath });
				//location.href = "./index.jsp?subPath=" + subPath;
			});
		}
	}



	/**
	 * 상위 폴더 이동 이벤트 입니다.
	 */
	$(".returnItem").click(function(){
		var subPath = $(this).attr("s");
		if(subPath == null || subPath == "") return false;

		var directorys = subPath.split("/");
		directorys.pop();
		if(directorys.length === 1){
			//location.href = "./index.jsp";
			submit();
		}else{
			submit({ "subPath" : directorys.join("/") });
			//location.href = "./index.jsp?subPath=" + directorys.join("/");
		}
	});

	/**
	 * 우측 목록의 아이템 클릭 이벤트 입니다.
	 */
	$(".item").click(function(){
		if($(this).find(".folder").length > 0) submit({ "subPath" : $(this).find(".folder").attr("s").replace("\\", "/") });
		if($(this).find(".image").length > 0) window.open($(this).find(".image").attr("src"));
		/*if($(this).find(".folder").length > 0) location.href = "./index.jsp?subPath=" + $(this).find(".folder").attr("s").replace("\\", "/");
		if($(this).find(".image").length > 0) window.open($(this).find(".image").attr("src"));*/
	});

	/**
	 * 전체 보기 이벤트 입니다.
	 */
	$("#gotoRootPath").click(function(){
		submit();
		//location.href = "./index.jsp";
	});

	/**
	 * 좌측 폴더 클릭 이벤트 입니다. (전체 보기 제외)
	 */
	$("#rootPath").find("li").not("#gotoRootPath").click(function(){
		var path = $(this).find("label").eq(0).attr("p");
		submit({ "scl" : $("#folderWrap").scrollTop(), "subPath" : "/" + path });
		//location.href = "./index.jsp?scl=" + $("#folderWrap").scrollTop() + "&subPath=/" + path;
	});

	/**
	 * CI 클릭 이벤트 입니다.
	 */
	$(".ci").click(function(){

	});

	/**
	 * 목록 보기, 크게 보기를 설정합니다.
	 */
	$(".viewOptionBtn").click(function(){
		var mode = $(this).attr("mode");

		$(".viewOptionBtn").removeClass("active");
		$(this).addClass("active");

		$("#sortable").find("li").attr("mode", mode);

		if("localStorage" in window){
			localStorage["WebFileViewerMode"] = mode;
		}

		if(mode === "list") $(".itemTitle").show();
		if(mode === "grid") $(".itemTitle").hide();
	});

	/**
	 * 로컬 스토리지에 설정된 옵션 기록이 있을 경우 해당 옵션으로 설정합니다.
	 */
	if(("localStorage" in window) && ("WebFileViewerMode" in localStorage)){
		$(".viewOptionBtn[mode=" + localStorage["WebFileViewerMode"] + "]").click();
	}else{
		$(".viewOptionBtn[mode=grid]").click();
	}

	/**
	 * 목록 보기 옵션에서 엘리먼트를 정렬합니다.
	 */
	var sortItems = function(idx, sortType){
		$(".item").sort(function(a, b){
			var aVal = $(a).find("label:eq(" + idx + ")").attr("sv");
			var bVal = $(b).find("label:eq(" + idx + ")").attr("sv");

			if(idx === 1){
				aVal = Number(aVal);
				bVal = Number(bVal);
				if(sortType === "desc"){
					return (aVal < bVal) ? 1 : ((aVal > bVal) ? -1 : 0);
				}else{
					return (aVal > bVal) ? 1 : ((aVal < bVal) ? -1 : 0);
				}
			}else{
				if(sortType === "desc"){
					return bVal.localeCompare(aVal);
				}else{
					return aVal.localeCompare(bVal);
				}
			}
		}).appendTo("#sortable");
	}

	/**
	 * 타이틀을 클릭했을때 item 을 정렬합니다.
	 */
	$(".itemTitle").find(".sortBtn").click(function(){
		if($(this).attr("sortType") == "" || $(this).attr("sortType") == null) $(this).attr("sortType", "asc");

		var txt = $(this).text().replaceAll(" ▲", "").replaceAll(" ▼", "")
		if($(this).attr("sortType") == "asc"){
			txt += " ▼";

			$(this).attr("sortType", "desc").text(txt);
		}else if($(this).attr("sortType") == "desc"){
			txt += " ▲";

			$(this).attr("sortType", "asc").text(txt);
		}

		sortItems($(this).index(), $(this).attr("sortType"));
	});

})();