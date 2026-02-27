/**
 * 웹 검색 객체 입니다.
 */
"use strict";

(function(GMXMAP){

if(GMXMAP != null){
	if(GMXMAP instanceof ol.Map){

		if($("#webSearchWrap").length === 0){
			$("#body").append("<div id='webSearchWrap' title='웹 검색 결과'></div>");
			$("#webSearchWrap").dialog({
				autoOpen : false,
				width: 800,
				height: 450
//				position: {
//					my: "right bottom",
//					at: "right bottom",
//					of: $("#map")
//				},
			}).parent().draggable({ containment: "#map", scroll: false });
		}

		$(".mainBar").append("<div class='search_box'><input type='search' placeholder='검색어를 입력하세요.'><div class='btn_wrap'><button class='btn_search'><i class='fas fa-search'></i></button><button class='search_close'></button></div></div>");
		
		$(".btn_search").click(function(){
			$(this).parent().parent().addClass('active');
		});
		$(".search_close").click(function(){
			$(this).parent().parent().removeClass('active');
		});

		$(".mainBar").find("input[type=search]").bind("contextmenu",function(e){
			e.stopPropagation();
		});

		var getWebSearch = function(str, limit, offset){
			if(!_common.utils.isNumber(limit)) limit = 10;
			if(!_common.utils.isNumber(offset)) offset = 1;

			$("#webSearchWrap").html("");

			var result = Spatial.convertAddrToXY(str, limit, offset);
			if(result == "error"){
				$("#webSearchWrap").dialog("close");
				alert("입력하신 주소가 존재하지 않습니다.");
			}else{
				var $wrap = $("#webSearchWrap");
				var $div = $("<div id='overWrap'></div>").css('height', '100%');
				var $head = $("<div id='searchHead' class='table_style'></div>").css({ "padding" : "0px !important", "max-height" : "650px", "height" : "88%" });
				var $div2 = $("<div class='customScroll'></div>").css({ "height" : "calc(100% - 5px)", "overflow-y" : "auto" });
				var $table = $("<table></table>").css({ "width" : "100%", "font-size" : "12px", "table-layout" : "auto" });
				var $paging = $("<div id='pagingWrap'></div>");

				var isEnd = result.meta.is_end;
				var doc = result.documents;
				for(var i=0; i<doc.length; i++){
					var jibun = _common.utils.validNull(doc[i].address_name);
					var doro = _common.utils.validNull(doc[i].road_address_name);

					if("address" in doc[i]) jibun = _common.utils.validNull(doc[i].address.address_name);
					if("road_address" in doc[i]){
						if(doc[i].road_address){
							if(!_common.utils.isNullAndEmpty(doc[i].road_address.address_name)){
								doro = doc[i].road_address.address_name;
							}
						}
					}
					var name = _common.utils.validNull(doc[i].place_name);
					var cate = _common.utils.validNull(doc[i].category_name);
					var phon = _common.utils.validNull(doc[i].phone);
					if(_common.utils.validNull(phon)) phon = " (" + phon + ")";
					var fullName = name + "<br>" + _common.utils.validNull(jibun);
					var lng = doc[i].x;
					var lat = doc[i].y;

					var $tr  = $("<tr class='resultTableTr'></tr>");
					var $td1 = $("<td class='resultTableTdName'>" + name + phon + "</td>");
					var $td2 = $("<td class='resultTableTdName'>" + jibun + "<br>" + doro + "</td>");
					if(result.isAddress){
						$td1.text(jibun);
						$td2.text(doro);
					}
					var $td3 = $("<td class='resultTableTdButton'><button class='btn_t'>위치</button></td>").attr({
						"jibun" : jibun,
						"doro" : doro,
						"name" : name,
						"cate" : cate,
						"phon" : phon,
						"lng" : lng,
						"lat" : lat
					});
					$td3.click(function(){
						var xy = [$(this).attr("lng"), $(this).attr("lat")];
						var text = $(this).attr("text");
						var t_epsg = GMXMAP.getView().getProjection().getCode();
						var center = Spatial.convertProjection(xy, "EPSG:4326", t_epsg);

						GMXMAP.addPulse(center, true);
					});

					$tr.append($td1).append($td2).append($td3);
					$table.append($tr);
				}

				$div2.append($table);
				if(!isEnd){
					if(offset == 1){
						$paging.append("<button id='nextSearch' class='btn_style'>다음</button>");
						$paging.find("#nextSearch").click(function(){
							getWebSearch(str, limit, offset + 1);
						});
					}else{
						$paging.append("<button id='prevSearch' class='btn_Bstyle' style='width: 50%;'>이전</button>");
						$paging.append("<button id='nextSearch' class='btn_Bstyle' style='width: 50%;'>다음</button>");
						$paging.find("#nextSearch").click(function(){
							getWebSearch(str, limit, offset + 1);
						});
					}
				}else{
					if(offset != 1){
						$paging.append("<button id='prevSearch' class='btn_style'>이전</button>");
					}
				}
				$head.append($div2);
				$div.html($head);
				$div.append($paging);
				$wrap.html($div);

				$paging.find("#prevSearch").click(function(){
					if(offset == 1){
						alert("이전 검색결과가 존재하지 않습니다.");
					}else{
						getWebSearch(str, limit, offset - 1);
					}
				});
			}

		}

		/**
		 * 검색어를 이용하여 Web 검색합니다.
		 */
		var search = function(){
			var val = $(".search_box").find("input[type=search]").val();

			if($(".search_box").hasClass("active")){
				if(_common.utils.isNullAndEmpty(val)){
					//alert("검색어를 입력해 주세요.");
				}else{
					if($("#webSearchWrap").dialog("isOpen")){
						getWebSearch(val);
					}else{
						$("#webSearchWrap").dialog({
							width: 800,
							height: 450,
							position: {
								my: "right bottom",
								at: "right bottom",
								of: $("#map")
							},
							open: function(){
								//$(this).parent().css({ "right" : 0, "bottom" : 0 });
								getWebSearch(val);
							},
							close: function(){
								$("#webSearchWrap").dialog("close");
							}
						}).dialog("open").parent().draggable({ containment: "#map", scroll: false });
					}
				}
			}

			$(".search_box").find("input[type=search]").focus();
		}

		/* 검색 버튼 이벤트 입니다. */
		$(".search_box").find(".btn_search").click(function(){
			search();
		});
		/* 검색창 엔터 이벤트 입니다. */
		$(".search_box").find("input[type=search]").keyup(function(e){
			if(e.which == 13) $(".search_box").find(".btn_search").click();
		});

	}
}

})(GMXMAP);