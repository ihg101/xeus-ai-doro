/**
 * <pre>
 * Bing 지도를 ol.layer.Tile 객체로 리턴합니다.
 *
 * @author 이주영
 * </pre>
 */
var BingMap = function(){

	var _API_KEY_ = "AqoaZ8HsYlXOuJ2klbJ6f5V39uAB44_R74RfssBFeFqbxhq23YZK72KLGTRovu1Y";
	var _API_LANG_ = "ko";

	this.createRoadLayer = function(layerInfo){

		return new ol.layer.Tile({
			id		: "bing_road",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			minZoom : 19.333333333333343,
			schema  : "tms",
			geomType: "T",
			preload : 6,
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAADW0lEQVQ4T41US2/bRhicFd+k3k9aVeWkiI0YQYAAuaSn/IP+y557LlD00EMRFCiKIEETRLasyKpkWZZEyeJD4pIsdgWypBXE3YuE5e7ON9/MfOTNx58iPLBKvodaGKLUfsRPuus5nM0OpPgic1OQAUWvwLGWDz0J8n+Av9s6kPMFaMUa6NaFu7bgKk8h5tR7wCJUVYS99r4K7AXuw8Ade4NirQbFKPHHZsM+8s1nyOnNAwCjqMLzKIId/Srw7fJ6D0ypjyDyIRAJoigll1iLG4KEQuOI763GA8jVMw6akwtwnRWos0vO74E9BP9tHRSw8daglIJ8GPwWrbw5P8AKYIuB39fVXk6RE0SIzdeIAjt50LV3nCHTd+t5B+1PI9PQg7WyYH7TBbmzxpHnOxhan+AHW2x9B4qkg+laaHU4GNN1OZ2gfPpDAkoEA3JgYycYCHd3nOl8sYAoivBcB/WKecCWtbhab0FWlD1wFIRYexbG1iVCgeLYXkArNxIz2fMptPYrQNL4Y4qkYOtvMw+7tsOB600To8/nMBvdzHfWYraa5jH6vbcgVxfvI0a/1TIxnV5DxQC1vA6j0sroKhT2DBjTuNUKAAbP9lxvhtHlECdnL3HZe4dyqZy0nbl4s16h+/gMi/kY1PdBLs/f8RxXa21Mz39HWV4neWW6BjCgHb36Itj9Agb9PtfPWtzyInMQECLA5s5C0/yW7y1upzg+fgTyz7DHgZ3VBKXwKjMkfJdA7bzMMI0Zp9myAtj+ZHQB3Shgt/M4Q1XTud66VkDd7PAWswIkgYD89cevkUgoWvIsMySYrmrnNYiQQwySFu1LLbdmY1CiIF8oIaIhiJiDLBv82nh0wY1XKlZ5CjjjaPYmMyTivDJdY4D0L3Nz1lp7nVfLG6xXSzSPuhj2/wYNJbTbe2/ELY6nGpl9+jki9C4zJITKKSTjCNNxH6peRblWPWCdjlOSa9/F4GqCxyfP0fvwJ+q1JvRSnRfB/itqnk0LPmDIzdsfo3j4x2ZSas8wXy5RLDdwMxkir+ZQMU+4wWLANOM4Xt6W8ijFzmYuZuvm+jPXmpkqnmzEHv0SiYqWDAnZ/B6aoeP66hyiVuF6sceenD7N5DKtcTpmg957dJ/sDcmiE8coDc7a/S+eB/H0WeCEkwAAAABJRU5ErkJggg=='>",
			source  : new ol.source.BingMaps({
				imagerySet: "RoadOnDemand",
				key: _API_KEY_,
				culture: _API_LANG_,
				tileLoadFunction : function(imageTile, src){
					imageTile.getImage().src = src;
					if(_IS_PROXY_) imageTile.getImage().src = _PROXY_TILE_DATA_URL_ + src.replace("?", "&");
				}
			})
		});
	}

	this.createAerialLayer = function(layerInfo){

		return new ol.layer.Tile({
			id		: "bing_aerial",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAFGElEQVQ4TyWV2W8b1xnFf7PvHEri7lAiI1KKbCVuZLdOjaJ2HloUyFOf+temQBEUbR3DTWPECWq7jq2FpEhxETmcfaaYydvFBS4OzvnO77tC/+w0N+0KYRgSxhFxHOOHAZqmIcsi7XYb17FZr9csFzfkaYKiSEiSRBynZGmOqupESVbe5XnOerPCNHU+v39KEocYqsLHBz2OB8esZnNqu3WEzr1hniESRRGyqiDKEkEQoKoqkiSUwp1WE1WTWUynXF1doOsq/V6PqrvLxcUVP//8nihOcRyHlLx8t7e3S8XWkSUBkZxfP3hI1aowny1YL9cI3c8+yXNBKh0pqo7l2Gy3W/zIp763UyYhiwK9/j7ddpPr6zGT8RWWbnB29pAsg5ff/8BkNkNWlNJ1rb6H6zooqoC3XuN7Hk9//4T+RwekccY33/wdoXVymEuKRhCF6JqJZuisNmviOGTHdcmyiDgKaDUanBwP8be3vHv7higIGQyGDAfHvHr1E/979x5RkalUXe7cabPdblDUIskAVVFo1Ru0ai3ajU6ZktC+OygdFxGrik6SpWz8bTkjWZaxTbWck2VqdDvt8jydjCHLudPu4LpVnj9/gbcNaLZbuLsujVad6+sJmqbgbdfIooSEQJ6KPDz7DZbpIDz+6g+5ZliMJmPWtx6IAlGalKKqKpNmIVkUslN16HU/QhJzoq2HaRg0a00+fPjAf777nm6vT3d/nyDycaoV/HCLKMF4fMXmds3R0SckYcbpyWdMJzOEP/7lz6Xw67dvWMxXmLZFkmfEhbgokJOiCBlV16a2W8HUdaq2RbNRI9wEvH79lqvxiMHRMY5bYTqboRoacVJQsiVJEjzP4+xXD9BkDUlUefPfdwhHjz7PvY2PH4UYloluGiUaRXMVqWj4ppyxaag096o067USL11TSOOQ0dWExWKFu7OHKMukaYogipyPPtBo1ICM6XRaduT05D6bjY93GyCcPD7Lb2836LqOH4YYhoEoK4gipWDxUC8wIy+jazfq1Gs1sjzED25L1lfLLZJoIAoKm82Wg4ODEjtJzqjuVFBliaPBgH+/eEnFdtmt7CHce/wg9/xfIrEsh/l8hqIXy0NGIme5mNNuN/n03glZljG9HuNYFt1ehyRdl+hZ5g6SqLO+DUgSuLy8xHEsbEvFdQwWyxt+++gLnv3jGQf7h4xG4yLqT/MingL+WrPF+fl78iTFtAwMTSUIt6XL4eAQEYHJ9YjA2yArApKcopkGw8E9ZtMVf/36bxwN7+L7PpIsUK1YmKZaJnV4eMgPL1+hKiZ5BsKjr57m/sbjzn4X0zRZLOYs53Pqe7toukLVsXFsC0kERRQQyFje3HA1usByNfr9PmGQs1r5PHv2AlXRODjoc3p6l8VyjuetSuH9bg/P85EkhU77DsKDPz3Jix3sui6apparMw5DWo06ipRTcWxcS0dTZUhTotAnTaKyA5IilvglcdEHeP7td/hRzNMnX6LpKtVqBYSM8fWIfu+Qy8sRxb+gaTrC4Rf382K+Rf133CrL5QJbN7BNnXqtiqYo2IaCa5ul6816BWlCpVJhtVlRa9QxNJvzizFpknFzs8B23NJIu9PE3d1htV5SbMfVas3keoa3CRCGv3uYF1uoEDc0nelsgqEUxYLhoFfyaqoyWRKgShKSkBIGv5TxoNfj/cU53U4X3bQRRZkff/yJJE1pddoIgoBQfDphjG6ZDIfH/PNf3zIaT/k/DStOt6w4j94AAAAASUVORK5CYII='>",
			source  : new ol.source.BingMaps({
				imagerySet: "Aerial",
				key: _API_KEY_,
				culture: _API_LANG_,
				tileLoadFunction : function(imageTile, src){
					imageTile.getImage().src = src;
					if(_IS_PROXY_) imageTile.getImage().src = _PROXY_TILE_DATA_URL_ + src.replace("?", "&");
				}
			})
		});
	}

	this.createAerialWithLabelsOnDemandLayer = function(layerInfo){

		return new ol.layer.Tile({
			id		: "bing_aerial_label",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			preload : 6,
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAFGElEQVQ4TyWV2W8b1xnFf7PvHEri7lAiI1KKbCVuZLdOjaJ2HloUyFOf+temQBEUbR3DTWPECWq7jq2FpEhxETmcfaaYydvFBS4OzvnO77tC/+w0N+0KYRgSxhFxHOOHAZqmIcsi7XYb17FZr9csFzfkaYKiSEiSRBynZGmOqupESVbe5XnOerPCNHU+v39KEocYqsLHBz2OB8esZnNqu3WEzr1hniESRRGyqiDKEkEQoKoqkiSUwp1WE1WTWUynXF1doOsq/V6PqrvLxcUVP//8nihOcRyHlLx8t7e3S8XWkSUBkZxfP3hI1aowny1YL9cI3c8+yXNBKh0pqo7l2Gy3W/zIp763UyYhiwK9/j7ddpPr6zGT8RWWbnB29pAsg5ff/8BkNkNWlNJ1rb6H6zooqoC3XuN7Hk9//4T+RwekccY33/wdoXVymEuKRhCF6JqJZuisNmviOGTHdcmyiDgKaDUanBwP8be3vHv7higIGQyGDAfHvHr1E/979x5RkalUXe7cabPdblDUIskAVVFo1Ru0ai3ajU6ZktC+OygdFxGrik6SpWz8bTkjWZaxTbWck2VqdDvt8jydjCHLudPu4LpVnj9/gbcNaLZbuLsujVad6+sJmqbgbdfIooSEQJ6KPDz7DZbpIDz+6g+5ZliMJmPWtx6IAlGalKKqKpNmIVkUslN16HU/QhJzoq2HaRg0a00+fPjAf777nm6vT3d/nyDycaoV/HCLKMF4fMXmds3R0SckYcbpyWdMJzOEP/7lz6Xw67dvWMxXmLZFkmfEhbgokJOiCBlV16a2W8HUdaq2RbNRI9wEvH79lqvxiMHRMY5bYTqboRoacVJQsiVJEjzP4+xXD9BkDUlUefPfdwhHjz7PvY2PH4UYloluGiUaRXMVqWj4ppyxaag096o067USL11TSOOQ0dWExWKFu7OHKMukaYogipyPPtBo1ICM6XRaduT05D6bjY93GyCcPD7Lb2836LqOH4YYhoEoK4gipWDxUC8wIy+jazfq1Gs1sjzED25L1lfLLZJoIAoKm82Wg4ODEjtJzqjuVFBliaPBgH+/eEnFdtmt7CHce/wg9/xfIrEsh/l8hqIXy0NGIme5mNNuN/n03glZljG9HuNYFt1ehyRdl+hZ5g6SqLO+DUgSuLy8xHEsbEvFdQwWyxt+++gLnv3jGQf7h4xG4yLqT/MingL+WrPF+fl78iTFtAwMTSUIt6XL4eAQEYHJ9YjA2yArApKcopkGw8E9ZtMVf/36bxwN7+L7PpIsUK1YmKZaJnV4eMgPL1+hKiZ5BsKjr57m/sbjzn4X0zRZLOYs53Pqe7toukLVsXFsC0kERRQQyFje3HA1usByNfr9PmGQs1r5PHv2AlXRODjoc3p6l8VyjuetSuH9bg/P85EkhU77DsKDPz3Jix3sui6apparMw5DWo06ipRTcWxcS0dTZUhTotAnTaKyA5IilvglcdEHeP7td/hRzNMnX6LpKtVqBYSM8fWIfu+Qy8sRxb+gaTrC4Rf382K+Rf133CrL5QJbN7BNnXqtiqYo2IaCa5ul6816BWlCpVJhtVlRa9QxNJvzizFpknFzs8B23NJIu9PE3d1htV5SbMfVas3keoa3CRCGv3uYF1uoEDc0nelsgqEUxYLhoFfyaqoyWRKgShKSkBIGv5TxoNfj/cU53U4X3bQRRZkff/yJJE1pddoIgoBQfDphjG6ZDIfH/PNf3zIaT/k/DStOt6w4j94AAAAASUVORK5CYII='>",
			source  : new ol.source.BingMaps({
				imagerySet: "AerialWithLabelsOnDemand",
				key: _API_KEY_,
				culture: _API_LANG_,
				tileLoadFunction : function(imageTile, src){
					imageTile.getImage().src = src;
					if(_IS_PROXY_) imageTile.getImage().src = _PROXY_TILE_DATA_URL_ + src.replace("?", "&");
				}
			})
		});
	}

	this.createDarkLayer = function(layerInfo){

		return new ol.layer.Tile({
			id		: "bing_dark",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAACe0lEQVRIS62V1Y4qQRCGq5HFXYJDuOD9nwkLrsFlTr5KmrC7zCI5nUxgZrrrl5IxIuLIBysQCEilUpHL5SLD4VB2u91bUcwnwB6PR+LxuBQKBQVdLpdyvV7fA/Z4PM67h8LhsOTzeYFAv9+X/X7/FiibTSaTcWB8Pp9fOmyMkWw2q9d8PpfJZKJ2B4NB8fl8GsNxHH12PB7199EyrVZLgbnY+Ew9akulkpDjdrst2+1WQqGQOuD1em8YAJ5OpxsRhK3Xa90PMVMul51kMqnFsVgs9HIDRy2gqCVIp9NRAsViUWKxmAa8X/aec/wnti1EQ46j0agyJggvp9OpHA6Hb4E4jNparSZ+v19tRhEkuIfIarX6ZS0uRCIRQRzg1MR4PBZjjHHsSwgQnIAQIJBVT/BUKqXqsBHLeIbNtqXs/nulOAAwTn19fWncbrcrt3aiQiEAeC6Xg9GtVQjEIVgTgHsIAcwv6lFCHn/aDTCxcTSTyWjcb8D3uUEZPYrdvV5Pi44D5LFeryugrV4sBnSz2fzZFYiCNOC038MBQlsAgEqKAXtQgmWNRkNrgQUhQHnv1jb3bKzluPoQGHVYg2qUoBoSiURC0um0pgRbB4OB2gyBVxaWc75cLj8GtgXRbDZ1KBCcAUEhcRh19D25sr36CjB7SBOWu85qgPgIoPLnIkej0Uin1qNi+ouEbUtXYJTCjAq/X9gK4Gw20+L7ZAHuCowlKCYndmExeQUUi99Ve0/SFZgKZEoxUGzrMDQYk89a5xUXXIHpZVqHYkIZebWz9pXWeQbu2sfVavVms51OzNj/oRZSv4BJPNOFHraDAsUAUlS01rNP5zO1vP8HbkKua5kQOrcAAAAASUVORK5CYII='>",
			source  : new ol.source.BingMaps({
				imagerySet: "CanvasDark",
				key: _API_KEY_,
				culture: _API_LANG_,
				tileLoadFunction : function(imageTile, src){
					imageTile.getImage().src = src;
					if(_IS_PROXY_) imageTile.getImage().src = _PROXY_TILE_DATA_URL_ + src.replace("?", "&");
				}
			})
		});
	}

}