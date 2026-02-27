package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsStatMapper.java
 * 설  명 :
 *   통계 관련 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 12. 07.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 12. 07.
 * @version : 1.0
 * @see
 */
@Mapper("crmsStatMapper")
public interface CrmsStatMapper {

	public List<CrmsStatVo> getListUse(HashMap<String, String> map);

	public List<CrmsStatVo> getListSolve(HashMap<String, String> map);

	public List<CrmsStatVo> getListCrime(HashMap<String, String> map);

	public List<CrmsStatVo> getListNoUse(HashMap<String, String> map);

    public List<CrmsStatVo> getListView(HashMap<String, String> map);

    public List<CrmsStatVo> getListOrg(HashMap<String, String> map);

}
