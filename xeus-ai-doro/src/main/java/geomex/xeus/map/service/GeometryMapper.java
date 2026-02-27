package geomex.xeus.map.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  GeometryMapper.java
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
@Mapper("geometryMapper")
public interface GeometryMapper {

	public List<GeometryVo> getGeometry(HashMap<String, String> map);

	public List<HashMap<String, String>> getWfs(HashMap<String, String> map);

	public List<HashMap<String, String>> getBigdataWfs(HashMap<String, String> map);

	public List<HashMap<String, String>> getCableWfs(HashMap<String, String> map);

	public List<HashMap<String, String>> getMinMax(HashMap<String, String> map);

	public List<HashMap<String, String>> getCount(HashMap<String, String> map);

	public List<HashMap<String, String>> getPresetCCTV(HashMap<String, String> map);

}
