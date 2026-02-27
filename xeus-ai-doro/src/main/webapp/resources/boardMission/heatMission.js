var heatMission = {

	doWork : function() {

		xeusLayout.mapService.getMap().getView().animate({
			center : [ 214281.56020800944,364629.9955924462 ],
			zoom : 11,
			duration : 1000
		});

		setTimeout(function(){
			geomex.xeus.HEATTheme.createThemeWrap();
		}, 200)

		xeusLayout.StopEvent = function(){
			$("#heatThemeWrap").remove();
		}
	}
};