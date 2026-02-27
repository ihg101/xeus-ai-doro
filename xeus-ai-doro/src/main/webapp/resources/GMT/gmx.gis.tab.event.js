/**
 * 공간편집 수정 대상 레이어를 생성합니다.
 */
"use strict";

var shpParam = new FormData();

(function(GMXMAP, GMXLAYER) {

	if (GMXMAP != null && GMXLAYER != null) {

		if(tabName == 'gisEditTab'){
			var $select = $("#editLayerSelect");
			$select.children().not(":eq(0)").remove();

			for(var i=0; i<GMXLAYER.GroupList.length; i++){
				var groupName = GMXLAYER.GroupList[i].grpNm;
				$select.append("<optgroup grpk='" + GMXLAYER.GroupList[i].mgrSeq + "' label='" + GMXLAYER.GroupList[i].grpNm + "'></optgroup>");
			}

			for(var key in GMXLAYER.LayerList){
				var $optgroup = $select.find("optgroup[grpk=" + GMXLAYER.LayerList[key].group.mgrSeq + "]");
				if((GMXLAYER.LayerList[key].layer.lyrTyp !== "T" && GMXLAYER.LayerList[key].layer.modYn == "Y") || (GMXLAYER.LayerList[key].group.mgrSeq == 3)){
					if((key in GMXLAYER.LayerList) && !GMXLAYER.LayerList[key].isView){
						$optgroup.append("<option value='" + GMXLAYER.LayerList[key].layer.tblId + "'>" + GMXLAYER.LayerList[key].layer.lyrNm + "</optgroup>");
					}
				}
			}

			$select.sortOptgroup();
		}
	}

})(GMXMAP, GMXLAYER);