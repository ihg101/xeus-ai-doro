
	/**
	 *  권한에 따른 탭 표출
	 */
	function setTabByAuth(authMgrNo){
//		var tabIndex=$("#mainTabs").tabs('option','active');

		if(authMgrNo!=null){
			$("#mainTabs > div.top_box > ul > li:nth-child(1)").css("display","")
			$("#mainTabs > div.top_box > ul > li:nth-child(2)").css("display","")
			$("#mainTabs > div.top_box > ul > li:nth-child(3)").css("display","")

			if(!authMgrNo.contains("TAB001")){
				$("#layerTab").css("display","none");
				$("#mainTabs > div.top_box > ul > li:nth-child(1)").css("display","none")
			}
			if(!authMgrNo.contains("TAB002")){
				$("#gisEditTab").css("display","none");
				$("#mainTabs > div.top_box > ul > li:nth-child(2)").css("display","none")
			}
			if(!authMgrNo.contains("TAB003")){
				$("#systemTab").css("display","none");
				$("#mainTabs > div.top_box > ul > li:nth-child(3)").css("display","none")
			}

//			$("#mainTabs").tabs('option','active',0);
//			$("#mainTabs").tabs('option','active',1);
//			$("#mainTabs").tabs('option','active',2);
//
//			$("#mainTabs").tabs('option','active',tabIndex);
		}
	}