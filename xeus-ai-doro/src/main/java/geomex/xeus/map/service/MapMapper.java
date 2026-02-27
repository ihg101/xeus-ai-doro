package geomex.xeus.map.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  MapMapper.java
 * 설  명 :
 *   지도와 관련된 Mapper 입니다.
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
@Mapper("mapMapper")
public interface MapMapper {

	public ArrayList<MapVo> getFavList(HashMap<String, String> map);

	public MapVo getFavItem(HashMap<String, String> map);

	public int getFavCount(HashMap<String, String> map);

	public boolean delFav(HashMap<String, String> map);

	public boolean addFav(MapVo vo);

	public boolean editFav(MapVo vo);

}
