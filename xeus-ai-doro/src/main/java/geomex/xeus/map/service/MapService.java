package geomex.xeus.map.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  MapService.java
 * 설  명 :
 *   지도와 관련된 Service 입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 5.
 * @version :  1.0
 * @see
 */
@Service("mapService")
public class MapService extends EgovAbstractServiceImpl {

	@Resource(name = "mapMapper")
    private MapMapper mapper;

	/**
	 * 관심영역 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MapVo> getFavList(HashMap<String, String> map) throws Exception {

		ArrayList<MapVo> list = (ArrayList<MapVo>) mapper.getFavList(map);

		return list;
	}

	/**
	 * 관심영역 단건을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public MapVo getFavItem(HashMap<String, String> map) throws Exception {

		MapVo vo = mapper.getFavItem(map);

		return vo;
	}

	/**
	 * 관심영역 카운트를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getFavCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getFavCount(map);

		return count;

	}

	/**
	 * 관심영역을 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean delFav(HashMap<String, String> map) throws Exception {

		boolean state = mapper.delFav(map);

		return state;

	}

	/**
	 * 관심영역을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean addFav(MapVo vo) throws Exception {

		boolean state = mapper.addFav(vo);

		return state;
	}

	/**
	 * 관심영역을 수정합니다. (현재 사용되지 않습니다.)
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	public boolean editFav(MapVo vo) throws Exception {

		boolean state = mapper.editFav(vo);

		return state;
	}

}
