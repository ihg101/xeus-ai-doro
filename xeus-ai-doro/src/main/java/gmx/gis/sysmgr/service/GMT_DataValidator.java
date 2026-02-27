package gmx.gis.sysmgr.service;

import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

/**
 *
 * <pre>
 * MyBatis 데이터를 검증하는 객체 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_DataValidator {

	/**
	 *
	 * 숫자인지 검증합니다.
	 *
	 * @param typ
	 * @param col
	 * @return
	 * @throws Exception
	 */
	public static boolean isNumber(List<HashMap<String, Object>> typ, String col) throws Exception{

		boolean result = false;

		if(col != null && !"".equals(col)){
			for(int i=0; i<typ.size(); i++){
				HashMap<String, Object> map = typ.get(i);

				if(col.equals(map.get("col"))){
					if("number".equals(map.get("typ"))){
						result = true;
						break;
					}
				}
			}
		}else{
			throw new Exception("Unknwon Column Data Type. (Column name is " + col + ")");
		}

		return result;

	}

	/**
	 *
	 * 경위도 필드가 존재하는지 그리고 존재한다면 값이 유효한지 검증합니다.
	 *
	 * 경도의 값은 123 - 133 사이의 값이어야 하며,
	 * 위도의 값은 32 - 44 사이의 값일 경우만 대한민국 경위도 범위로 판정합니다.
	 *
	 * 만약 범위를 벗어날 경우 유효하지 않은 값으로 책정합니다.
	 *
	 * @param typ
	 * @param col
	 * @return
	 * @throws Exception
	 */
	public static boolean isGeolocationContains(HashMap<String, Object> spatialSt) throws Exception{

		boolean result = false;

		try {
			String geolocationLon = (String) spatialSt.get("geolocationLon");
			String geolocationLat = (String) spatialSt.get("geolocationLat");

			if(!StringUtils.isEmpty(geolocationLon) && !StringUtils.isEmpty(geolocationLat)){
				double lon = Double.parseDouble(geolocationLon);
				double lat = Double.parseDouble(geolocationLat);

				if(((lon > 123) && (133 > lon)) && ((lat > 32) && (44 > lat))){
					result = true;
				}
			}
		} catch (Exception e) {
			throw e;
		}

		return result;

	}

}
