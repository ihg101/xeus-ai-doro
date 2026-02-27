//UTM-K
proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.996 ' + '+x_0=1000000 +y_0=2000000 '
		+ '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
//
// 세계측지계 200000, 500000
proj4.defs('EPSG:5180', '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 ' + '+x_0=200000 +y_0=500000 '
		+ '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5181', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 ' + '+x_0=200000 +y_0=500000 '
		+ '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5182', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 ' + '+x_0=200000 +y_0=550000 '
		+ '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5183', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 ' + '+x_0=200000 +y_0=500000 '
		+ '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5184', '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 ' + '+x_0=200000 +y_0=500000 '
		+ '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
//
// 세계측지계 200000, 600000
proj4.defs('EPSG:5185', '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 ' + ' +x_0=200000 +y_0=600000 '
		+ '+ellps=GRS80 +units=m +no_defs');
proj4.defs('EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 ' + ' +x_0=200000 +y_0=600000 '
		+ '+ellps=GRS80 +units=m +no_defs');
proj4.defs('EPSG:5187', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 ' + ' +x_0=200000 +y_0=600000 '
		+ '+ellps=GRS80 +units=m +no_defs');
proj4.defs('EPSG:5188', '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 ' + ' +x_0=200000 +y_0=600000 '
		+ '+ellps=GRS80 +units=m +no_defs');

// 오류보정된 Bessel
proj4.defs('EPSG:5173', '+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 ' + ' +x_0=200000 +y_0=500000 '
		+ '+ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5174', '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 ' + ' +x_0=200000 +y_0=500000 '
		+ '+ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5175', '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 ' + ' +x_0=200000 +y_0=550000 '
		+ '+ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5176', '+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 ' + ' +x_0=200000 +y_0=500000 '
		+ '+ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5177', '+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 ' + ' +x_0=200000 +y_0=500000 '
		+ '+ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');