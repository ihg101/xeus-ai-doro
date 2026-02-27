var cctvMission = {

	doWork : function() {

		xeusLayout.mapService.getMap().getView().animate({
			center : [ 211594.147, 371755.67 ],
			zoom : 18,
			duration : 1000
		});

		setTimeout(function(){
			geomex.xeus.CCTVTheme.createThemeWrap();
		}, 200);

		xeusLayout.StopEvent = function(){
			$("#themeWrap").remove();
		}
	}

};