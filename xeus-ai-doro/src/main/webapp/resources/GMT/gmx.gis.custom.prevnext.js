/**
 * 지도 이전, 다음 객체입니다.
 *
 * @author 이주영
 */
ol.Map.prototype.addCustomPrevNext = function(){

	var _Map = this;

	if(ol.Map.prototype.moveCount === undefined) ol.Map.prototype.moveCount = 0;
	if(ol.Map.prototype.moveList === undefined) ol.Map.prototype.moveList = new Array();
	if(ol.Map.prototype.isMove === undefined) ol.Map.prototype.isMove = false;

	if(ol.Map.prototype.getNext === undefined){
		ol.Map.prototype.getNext = function(){
			if (this.moveList.length -1 > this.moveCount){
				this.moveCount++;
				this.isMove = true;

				var mapCenter = this.moveList[this.moveCount];
				this.getView().setCenter(mapCenter[0]);
				this.getView().setZoom(mapCenter[1]);
			}
		}
	}

	if(ol.Map.prototype.getPrev === undefined){
		ol.Map.prototype.getPrev = function(){
			if (this.moveCount > 0){
				this.moveCount--;
				this.isMove = true;

				var mapCenter = this.moveList[this.moveCount];
				this.getView().setCenter(mapCenter[0]);
				this.getView().setZoom(mapCenter[1]);
			}
		}
	}

	/* 이전, 다음, 이동이력 함수 등록 */
	this.on("moveend", function(){
		var mapMoveCnt = _Map.moveList.length;
		var mapCenter = new Array( _Map.getView().getCenter(), _Map.getView().getZoom() );

		if(_Map.moveList[mapMoveCnt - 1] != mapCenter && !_Map.isMove){
			if(_Map.moveList.length == 10) _Map.moveList.splice(0, 1);
			_Map.moveList.push(mapCenter);
			_Map.moveCount = _Map.moveList.length - 1;
		}

		_Map.isMove = false;
	});

	(function(){
		var mapMoveCnt = _Map.moveList.length;
		var mapCenter = new Array( _Map.getView().getCenter(), _Map.getView().getZoom() );

		if(_Map.moveList[mapMoveCnt - 1] != mapCenter && !_Map.isMove){
			if(_Map.moveList.length == 10) _Map.moveList.splice(0, 1);
			_Map.moveList.push(mapCenter);
			_Map.moveCount = _Map.moveList.length - 1;
		}

		_Map.isMove = false;
	})();

}