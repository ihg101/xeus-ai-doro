package geomex.xeus.map.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  GeometryService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 9. 5.
 * @version :  1.0
 * @see
 */
@Service("geometryService")
public class GeometryService extends EgovAbstractServiceImpl {

	@Resource(name = "geometryMapper")
    private GeometryMapper mapper;

	public ArrayList<GeometryVo> getGeometry(HashMap<String, String> map) throws Exception {

		ArrayList<GeometryVo> list = (ArrayList<GeometryVo>) mapper.getGeometry(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getWfs(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getWfs(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getBigdataWfs(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getBigdataWfs(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getCableWfs(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getCableWfs(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getData(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getWfs(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getMinMax(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getMinMax(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getCount(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getCount(map);

		return list;
	}

	public ArrayList<HashMap<String, String>> getPresetCCTV(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getPresetCCTV(map);

		return list;
	}

}
