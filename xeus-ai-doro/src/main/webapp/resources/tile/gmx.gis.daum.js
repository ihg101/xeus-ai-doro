/**
 * <pre>
 * 카카오  지도를 ol.layer.Tile 객체로(XYZ) 리턴합니다.
 *
 * @author 이주영
 * </pre>
 */
var DaumMap = function(){

	var _Projection = new ol.proj.get("EPSG:5181");
	var _Origin = [ -30000, -60000 ];
	var _Resolutions = [ 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125 ];

	this.createMapLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_map",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAADW0lEQVQ4T41US2/bRhicFd+k3k9aVeWkiI0YQYAAuaSn/IP+y557LlD00EMRFCiKIEETRLasyKpkWZZEyeJD4pIsdgWypBXE3YuE5e7ON9/MfOTNx58iPLBKvodaGKLUfsRPuus5nM0OpPgic1OQAUWvwLGWDz0J8n+Av9s6kPMFaMUa6NaFu7bgKk8h5tR7wCJUVYS99r4K7AXuw8Ade4NirQbFKPHHZsM+8s1nyOnNAwCjqMLzKIId/Srw7fJ6D0ypjyDyIRAJoigll1iLG4KEQuOI763GA8jVMw6akwtwnRWos0vO74E9BP9tHRSw8daglIJ8GPwWrbw5P8AKYIuB39fVXk6RE0SIzdeIAjt50LV3nCHTd+t5B+1PI9PQg7WyYH7TBbmzxpHnOxhan+AHW2x9B4qkg+laaHU4GNN1OZ2gfPpDAkoEA3JgYycYCHd3nOl8sYAoivBcB/WKecCWtbhab0FWlD1wFIRYexbG1iVCgeLYXkArNxIz2fMptPYrQNL4Y4qkYOtvMw+7tsOB600To8/nMBvdzHfWYraa5jH6vbcgVxfvI0a/1TIxnV5DxQC1vA6j0sroKhT2DBjTuNUKAAbP9lxvhtHlECdnL3HZe4dyqZy0nbl4s16h+/gMi/kY1PdBLs/f8RxXa21Mz39HWV4neWW6BjCgHb36Itj9Agb9PtfPWtzyInMQECLA5s5C0/yW7y1upzg+fgTyz7DHgZ3VBKXwKjMkfJdA7bzMMI0Zp9myAtj+ZHQB3Shgt/M4Q1XTud66VkDd7PAWswIkgYD89cevkUgoWvIsMySYrmrnNYiQQwySFu1LLbdmY1CiIF8oIaIhiJiDLBv82nh0wY1XKlZ5CjjjaPYmMyTivDJdY4D0L3Nz1lp7nVfLG6xXSzSPuhj2/wYNJbTbe2/ELY6nGpl9+jki9C4zJITKKSTjCNNxH6peRblWPWCdjlOSa9/F4GqCxyfP0fvwJ+q1JvRSnRfB/itqnk0LPmDIzdsfo3j4x2ZSas8wXy5RLDdwMxkir+ZQMU+4wWLANOM4Xt6W8ijFzmYuZuvm+jPXmpkqnmzEHv0SiYqWDAnZ/B6aoeP66hyiVuF6sceenD7N5DKtcTpmg957dJ/sDcmiE8coDc7a/S+eB/H0WeCEkwAAAABJRU5ErkJggg=='>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://map" + subdomain + ".daumcdn.net/map_2d/2103dor/L" + level + "/" + row + "/" + col + ".png";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createTileLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_tile",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAFGElEQVQ4TyWV2W8b1xnFf7PvHEri7lAiI1KKbCVuZLdOjaJ2HloUyFOf+temQBEUbR3DTWPECWq7jq2FpEhxETmcfaaYydvFBS4OzvnO77tC/+w0N+0KYRgSxhFxHOOHAZqmIcsi7XYb17FZr9csFzfkaYKiSEiSRBynZGmOqupESVbe5XnOerPCNHU+v39KEocYqsLHBz2OB8esZnNqu3WEzr1hniESRRGyqiDKEkEQoKoqkiSUwp1WE1WTWUynXF1doOsq/V6PqrvLxcUVP//8nihOcRyHlLx8t7e3S8XWkSUBkZxfP3hI1aowny1YL9cI3c8+yXNBKh0pqo7l2Gy3W/zIp763UyYhiwK9/j7ddpPr6zGT8RWWbnB29pAsg5ff/8BkNkNWlNJ1rb6H6zooqoC3XuN7Hk9//4T+RwekccY33/wdoXVymEuKRhCF6JqJZuisNmviOGTHdcmyiDgKaDUanBwP8be3vHv7higIGQyGDAfHvHr1E/979x5RkalUXe7cabPdblDUIskAVVFo1Ru0ai3ajU6ZktC+OygdFxGrik6SpWz8bTkjWZaxTbWck2VqdDvt8jydjCHLudPu4LpVnj9/gbcNaLZbuLsujVad6+sJmqbgbdfIooSEQJ6KPDz7DZbpIDz+6g+5ZliMJmPWtx6IAlGalKKqKpNmIVkUslN16HU/QhJzoq2HaRg0a00+fPjAf777nm6vT3d/nyDycaoV/HCLKMF4fMXmds3R0SckYcbpyWdMJzOEP/7lz6Xw67dvWMxXmLZFkmfEhbgokJOiCBlV16a2W8HUdaq2RbNRI9wEvH79lqvxiMHRMY5bYTqboRoacVJQsiVJEjzP4+xXD9BkDUlUefPfdwhHjz7PvY2PH4UYloluGiUaRXMVqWj4ppyxaag096o067USL11TSOOQ0dWExWKFu7OHKMukaYogipyPPtBo1ICM6XRaduT05D6bjY93GyCcPD7Lb2836LqOH4YYhoEoK4gipWDxUC8wIy+jazfq1Gs1sjzED25L1lfLLZJoIAoKm82Wg4ODEjtJzqjuVFBliaPBgH+/eEnFdtmt7CHce/wg9/xfIrEsh/l8hqIXy0NGIme5mNNuN/n03glZljG9HuNYFt1ehyRdl+hZ5g6SqLO+DUgSuLy8xHEsbEvFdQwWyxt+++gLnv3jGQf7h4xG4yLqT/MingL+WrPF+fl78iTFtAwMTSUIt6XL4eAQEYHJ9YjA2yArApKcopkGw8E9ZtMVf/36bxwN7+L7PpIsUK1YmKZaJnV4eMgPL1+hKiZ5BsKjr57m/sbjzn4X0zRZLOYs53Pqe7toukLVsXFsC0kERRQQyFje3HA1usByNfr9PmGQs1r5PHv2AlXRODjoc3p6l8VyjuetSuH9bg/P85EkhU77DsKDPz3Jix3sui6apparMw5DWo06ipRTcWxcS0dTZUhTotAnTaKyA5IilvglcdEHeP7td/hRzNMnX6LpKtVqBYSM8fWIfu+Qy8sRxb+gaTrC4Rf382K+Rf133CrL5QJbN7BNnXqtiqYo2IaCa5ul6816BWlCpVJhtVlRa9QxNJvzizFpknFzs8B23NJIu9PE3d1htV5SbMfVas3keoa3CRCGv3uYF1uoEDc0nelsgqEUxYLhoFfyaqoyWRKgShKSkBIGv5TxoNfj/cU53U4X3bQRRZkff/yJJE1pddoIgoBQfDphjG6ZDIfH/PNf3zIaT/k/DStOt6w4j94AAAAASUVORK5CYII='>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://map" + subdomain + ".daumcdn.net/map_skyview/L" + level + "/" + row + "/" + col + ".jpg";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createTerrainLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_terrain",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAABrklEQVQ4T52VS47CMAyGbaAgoKrKIbhAz86OI7BGiBX7Sn2AgPLO6LfkTqZKppmxhHg5/vzbjstFURhy2OPxoNPpRMYYer/fPzwGgwGNRiOK45jG47HruPO38/lM1+uVPp8PcRcM4O12o/v9Lg4A24bvzEzD4ZAWi4UkEGrP55OKohD3FgwIsgEUn/GyDTCYZMtMUA21aZr2cgG8XC5y9vV6fSvWsvqAgEAh1CKIWp9qG2hnBx4fDgfjK6sCVS0OI1ifah9Q4VDNu93OuMoKNQB3zacavgrsrT16vN1u2+nRoXEBNRj6CoAqd1XlT+CQAJPJhObzuQxIXdfyrlMeRZEMXahJqQH9TaUGg49OMcAYEr1y+A/wUOM8z83xeAz1F8VQ/l/VupDkHmNDIVCI+VTjrG40Vxy9qloh3u/3BiqapunlYrBms1nbFiRbVZWsVF+vu0DZWszE6/XaZFkme9mlWnuH5FyGXmMP6GpV1T5gC16tVma5XNJ0OpUA9iBhWHxAexl0VQNu73mddl21mBHebDYGWUN1WZZSxhCgrd5WbT9UFKhtwAMlSRLZ8V8gZXw7Aivn8gAAAABJRU5ErkJggg=='>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://map" + subdomain + ".daumcdn.net/map_shaded_relief/3.00/L" + level + "/" + row + "/" + col + ".png";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createHybridLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_hybrid",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAACpElEQVQ4T7VVS0wTURQ9098UplPbWjr9yFijEBJTPoaILAyJGBNdsDBhAxvi0sSFCxPX7ly5dufCrS5wZaJBNxKDian4aUEQsFBqa4tMv7Z0zLvwik1BPsG7mk/mnnvOPeeNEBy+q1c3Ksj+SiOdXAWV2wm1qxPZmWm6tbWHoC0tIjO7sPn+CEpwDd7Qa4B/NfR0nYXV7UZm8gVsHd0wO91YCn8AUpkjgAUEdF7Td+ukDg6gkl3HypvnUK8Mo5hK4Uf40/8HdrYFIasnSXKj1Yomte3IJP8nY75rYj3+CL6rIyQ53X+cAXK5Q7PfHXjLYBulEpZfj0OWndC+fYYj1AepvRtGUUQmGoUW2zLkAUfYEZhLzPerdPVDVE6Q0TQtA6Ti8A+NwWSzH5p9A/BuoIw5q+UnD0ny+NQEXMEOihqrg7KvA+YRKidiiIcnwZmyDLPiRuPZXp9+i7X4EgIDQyQ9uf7rwr52L+DSqI7Cb3jOBCm3zMHphQg1Y5VPrNYODn9fD8nLJJdD5+m6nEkRez4keSIS3TPvQuDmPV0vl6gJAy3/TMB+7mIDKD2QJKgXelFKxJAIT1K2ebFhjDa5Zry9TjpBvX1fZ1MWFmdQXU/D3jsAmvr99I6StYZ6IKoKUlOvIHoCZDpeNNDLp/uKneAbu6MXYnMwiM2wtp6GXswjHt1hTxYRitsLsVmC6ZSXsOYfPyB3C2YRZU2jVfH4OXxqPfuVZB0RAUpA9w1eh8HRgupaEvFwBDCa61LpavHC7vJsP7OYYFI9yC3OIjsfgbP/Mp1olUIR9mCQjEZeeTdRY88+rhTyqOTy1EdQRm7posePwvc5JL9EAZO8DSBJ8B/3wtIkNRwPgiLDKMtITDxr+IlwE3LjMfbmYy6YZCcMzZv9/wBcPVsXrQyYfAAAAABJRU5ErkJggg=='>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://map" + subdomain + ".daumcdn.net/map_hybrid/2103dor/L" + level + "/" + row + "/" + col + ".png";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createCbndLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_cbnd",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,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'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://map" + subdomain + ".daumcdn.net/map_usedistrict/2009alo/L" + level + "/" + row + "/" + col + ".png";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	//https://bbong95.github.io/leaflet/2018/08/06/Leaflet-%EB%A7%9B%EB%B3%B4%EA%B8%B0-4%ED%83%84/
	this.createRealTimeRoadLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_road",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAE7klEQVRIS42VW2xUVRSGv31uM2fubWGmVWhrSwEBWyMFEVSMiUblgcQY4x0rGILRaIw+aUCfVDDog4IgRBMxCihCFGNVioliopjIpSEgtrS1ttDSDrRzOXPO2WebTl9sgokrWY97/Wut/1//Fso5rKTWzHhekc/lcD0XXdcwTQMhBP8nEvEYNp8jcltw48/T4Sf5+vJ+7ks+RLO6HqdYBNSUUkJdWKowaiG0HF9fjuNfhZQSKX2CYCIVSgUoNfXhv6skEyls9RmMv46XeIVDfpyvL+3n4YonaJKzcZ0J4KkhlPOjwvsVlAOhFeCnUEqiwtNQgSQgjJQK3/fxPBffdwkCOaWRZDKJLT+E3Fbc5EbaXY/DY+08UrGaeu8a3JJzBeDcxwr7ThAVkO+BM2+BlYL65eB/CloVMrKOEcIgNOJaHEuF8LwSrlvC9z2iUZ1Q6R1wvqSY2MjB4iC/5I/wYOpx6r36/wAebFKYCyC8AvQbYeBnGD4CjY+C3Qt+L+etu9iePcB5b5C0WU3GrCFtZsgYNVQbVzHDrCKcfxucbykl3uQnL8/JwjHuTqwk46avzLHMH1CafwScDtBrwVwLl7JgzoUxH2yLXNU0ztDHkH+eUXmREX+EfDBOTo6T0FOsqmqjOjgH7lGU2UIpyJUzYjYCDXh+pCwtKYMyTRMaEoODfSqdrkSoUZDDZS4EDfDbMXh/Cwz2QySCapiFallIMH8BQSaDtEOUbJ3ANEgqA33wG9BDMP1ayL0GzkFQHogoGPVgtaLMxWDOR4lKRGfncTVzZi1G1KTTOU5IC9NkzSYyOgadx6CnFwb64e9+uDgEE6dhh2F6BmbUwdJbobURTq6HeCPMeRZUH7gnIPgL/AGQvSD7IcgCHmhJxKGO71RNTTUz6+s4XGqnY6yde5IruT3Uij76O0gNwvOQBYm4nEUMD8PIMGLoAmRH4cZl0GzC6U1w9UqovQ3cH8pCxGgALT2p6ImrCS5DMALyAmLHju0qnU6zZMliSGh8mN1Gr9vNuqp1zBvtQwwchNoHcJI3UXBKCBWgCQ0dgSkElm0jujbD0CGYvx6VikJuC8I7AbiANrlubRro1aDXlLUkXn75JbVoUSuLFt2AZln0Wl3sHH2XueH5tNkrSHV/DIGH37COPFUUy2YwaSaxWJKo34fo3ACVC8k1tnFW9hPTotRZdehyHOF3I+SfiAnxTaxbDpRXLjZt2qSammaVgWWgEJWC3eMf0VM6y5MVa2ge6Ya/90P9KorJWxgvFAiCAF03SMbjWAN7oO8Tgrkv0pmo4oORbSyJ3Myd9j1QmuxRNwwMY6LVPFKNYRsOYtu291Qmk6a5pRldg1gqwWlxil2jO1kSW8a92vXE/tgCdjWy6QUuFYKyeUQiMeJ6AXH8OTDiuAvWs7v4Pe1jX7Gm8mmuC5opFYoITUy6nFIMlM5zLlvCNjXE3r17VDQaZe61cwhZBpZlIaI6X+T30Fk8xmMVbbRc7ELv31ee2qm8nVyhSDweIzS4D7q2o2Y/Q8/0FjYPvUHaqGZ18inMgl52tfJHoxSFoMDRoU6KhRhVcYk4deqkkkFAPBohFDIRmkbItvlTO8uu7E7mhZu5P3IHqTNbwc8RzNuAa0zH8i6gndpQ5tq57lU+dzrK07ZVrGWhtphiIT/Fz7vyXXRnLyJ0l7poNf8A9sZD734oh1QAAAAASUVORK5CYII='>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4);

					return _PROXY_TILE_DATA_URL_ + "http://r" + subdomain + ".maps.daum-img.net/mapserver/file/realtimeroad/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createRoadViewLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_roadview",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAACpElEQVQ4T7VVS0wTURQ9098UplPbWjr9yFijEBJTPoaILAyJGBNdsDBhAxvi0sSFCxPX7ly5dufCrS5wZaJBNxKDian4aUEQsFBqa4tMv7Z0zLvwik1BPsG7mk/mnnvOPeeNEBy+q1c3Ksj+SiOdXAWV2wm1qxPZmWm6tbWHoC0tIjO7sPn+CEpwDd7Qa4B/NfR0nYXV7UZm8gVsHd0wO91YCn8AUpkjgAUEdF7Td+ukDg6gkl3HypvnUK8Mo5hK4Uf40/8HdrYFIasnSXKj1Yomte3IJP8nY75rYj3+CL6rIyQ53X+cAXK5Q7PfHXjLYBulEpZfj0OWndC+fYYj1AepvRtGUUQmGoUW2zLkAUfYEZhLzPerdPVDVE6Q0TQtA6Ti8A+NwWSzH5p9A/BuoIw5q+UnD0ny+NQEXMEOihqrg7KvA+YRKidiiIcnwZmyDLPiRuPZXp9+i7X4EgIDQyQ9uf7rwr52L+DSqI7Cb3jOBCm3zMHphQg1Y5VPrNYODn9fD8nLJJdD5+m6nEkRez4keSIS3TPvQuDmPV0vl6gJAy3/TMB+7mIDKD2QJKgXelFKxJAIT1K2ebFhjDa5Zry9TjpBvX1fZ1MWFmdQXU/D3jsAmvr99I6StYZ6IKoKUlOvIHoCZDpeNNDLp/uKneAbu6MXYnMwiM2wtp6GXswjHt1hTxYRitsLsVmC6ZSXsOYfPyB3C2YRZU2jVfH4OXxqPfuVZB0RAUpA9w1eh8HRgupaEvFwBDCa61LpavHC7vJsP7OYYFI9yC3OIjsfgbP/Mp1olUIR9mCQjEZeeTdRY88+rhTyqOTy1EdQRm7posePwvc5JL9EAZO8DSBJ8B/3wtIkNRwPgiLDKMtITDxr+IlwE3LjMfbmYy6YZCcMzZv9/wBcPVsXrQyYfAAAAABJRU5ErkJggg=='>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://map" + subdomain + ".daumcdn.net/map_roadviewline/7.00/L" + level + "/" + row + "/" + col + ".png";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}


	/* 환경지도 */

	this.createFineDustLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_finedust",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_pm10/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createYellowDustLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_yellowdust",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_ysnd/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createNo2Layer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_no2",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_no2/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createSo2Layer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_so2",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_so2/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createCaiLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_cai",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_khai/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createPm25Layer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_pm25",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_pm25/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createO3Layer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_o3",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_o3/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

	this.createCoLayer = function(layerInfo){
		//if(visible == null) visible = false;

		return new ol.layer.Tile({
			id		: "daum_co",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAEpElEQVRIS2WUy4tlVxXGf2vv87rnPupWpWI6TWs0GAkafAcJOnIgogNBRZzov+AsEBJthJB5ZgmJSSAQYkQnGhyJDkRRCAqhMQqmO+mO1d1V3feeuve899lL9rldIeKanMM+j/V93/q+JY8/85J2Zp9Z92cuHB5wuimoug5rYkzs6DpIU6GqBgbn8erJJhFtMxBH0DYeVVjOUjaLH1IeXYWho21rxCZ8sIzvwPfjkTz2wp80dv/kwuyEttnQDwaRBj8I3uYIFfN5zO2iJk9ibJRw/WiFesUD5z+8x7F+De8s5c0CAVy1Ik4X+CQHVzJ0HSoG6bdolJNkOfLYi3/Rc/73ZLGj6ZqAha3eTZN9HT+9B99sSFe/5PzyGJsaiq1nW1Q4HYiigWjxCFX6ZdpbN/BduyPYbzHpDMTgNkf03oz/FQmwIJvuIY+/+He19eucnycUbUabPUSffAKMQQUUwXQV/fYmDxz+lmLVUNWOqu6ZzWLq6Ev4yefp1id45zAWsAnJbM7m8t9wakeVzkpVyQ/OIRd/cUWX29do0s9SRp9GjUcUUI8ai9mBhPJtzqevk2nKO8cFbdkRCBzsp6yXP6JdHePrDWIs6fwAV95mc3wFE0/Jk5zOt0QSoeGjdIFc/PkVHaLpTgruDF7ZsfW6ezGQKN7iMP0DzrXUjcP1nrbqiFJDYieU+XdoNw0iSjKd05Ulzfo9omRCnC/BD6hrER+cAfLjl99UmR6OzjyrwHgID88Ofc9B+QzZ1Iwu7p2j7xX1PcPgcb1iNaPKvwc2Jo6DtJ56dYwkE+gbTDZjKK5DlCDeIY8+9xtNF59E4snYPLAMFZjK2X31D2buDfJ4Revczj+9MptfoFydkGcZYi03hq/ifIp3PcZXDE4Is8qWd6N9R/nepdHtmkyQ51/5qb7jvwnxh/DGImNIwiyC+DtZfFUg3RUW0XWm9pTIVERS4WcPsilOMVVNpkqZ38OxfgFXluN3cRTRVwXWWvrNLcxkicQBJMjTzz+h86ml9xY3QDksWE+/ixETtN6xx+C7Ere+jPcN3/jKfWyKE65de5dh6Fnahr4J/lBWyUdYuYdo6y3UK/ywRTRCkjnp4hCTpgER8uzLTyrGE8VK5COu9p+hnnwRUf9+4+AHCUCGlqQ74eP39iyzE95869986oGPcuPy5WA/XBzmr9xIv0V57V+EbAVrGmNRE2GNYNIJ0WIf+dmrT+nK3cfa75ENBXX6OUj2d8a6w3hsHKiHbLst98vvwLWUw8D+3l2sbxekqVINEV1Tcjr/PtW7lzBxhqpHbEzQ1yQZJopJ5nPk4ku/Vr94BKMN2tT4ZDpKu2M8WnvMllel707xfcEF81fa8j9EIiwPP8bRccEyFzad4LqW9vDbNCfrcWePAw11Z4lkkwkyWyJPvHZVJYoRFD+EPRUm9f8VGge5vXek1R9h/Qb78wWSztkUNbPccKvssU5pz/2A9ubVMUo6uJGxEcFEETZOMNM58pNfHYUtdkZsvIYm/xPq3e4cFfACfb3i4Xsv8fatFcNmw1BVTPfOYakx2nNTH6bextgsJzYGO9/DB9BDj40zQkr/C6T+bum6RJ32AAAAAElFTkSuQmCC'>",
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {

					var level = 14 - coordinate[0];
					//var row = coordinate[2];
					var row = (coordinate[2] * -1) - 1;
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return _PROXY_TILE_DATA_URL_ + "http://airinfo.map.kakao.com/mapserver/file/airinfo_co/T/L" + level + "/" + row + "/" + col + ".png?v=" + _common.utils.Random.getGUID12();
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});
	}

}