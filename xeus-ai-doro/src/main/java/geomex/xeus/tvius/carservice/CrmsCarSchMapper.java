package geomex.xeus.tvius.carservice;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsCarSchMapper.java
 * 설  명 :
 *   차량검색 관련 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 01.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 10. 01.
 * @version : 1.0
 * @see
 */
@Mapper("crmsCarSchMapper")
public interface CrmsCarSchMapper {

	public List<CrmsCarSchVo> getList(HashMap<String, String> map);

	public CrmsCarSchVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public List<CrmsCarSchVo> getCarNoList(HashMap<String, String> map);

}
