/**
 * <pre>
 * 통계관련 이벤트 입니다.
 * </pre>
 *
 * @auther 이은규(xeusGlobalCCTV 복사)
 */
Public.STAT = {
	Map : {
		Clear : function() {
			//페이지 이동 시 히트맵 레이어를 삭제
			if (statCctvHeatLayer != null )	{
				if(statCctvHeatLayer instanceof ol.layer.Vector){
					statCctvHeatLayer.getSource().clear();
					xeusLayout.mapService.getMap().removeLayer(statCctvHeatLayer);
				}
				statCctvHeatLayer = null;
			}
			if (statEvtHeatLayer != null) {
				if(statEvtHeatLayer instanceof ol.layer.Vector){
					statEvtHeatLayer.getSource().clear();
					xeusLayout.mapService.getMap().removeLayer(statEvtHeatLayer);
				}
				statEvtHeatLayer = null;
			}
		}
	}
}