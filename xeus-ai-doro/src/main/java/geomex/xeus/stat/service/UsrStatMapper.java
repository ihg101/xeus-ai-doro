package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  UsrStatMapper.java
 * 설  명 :
 *   사용자 접속통계 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-10-30      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 10. 30.
 * @version :  1.0
 * @see
 */
@Mapper("usrStatMapper")
public interface UsrStatMapper {

	public ArrayList<UsrStatVo> getYearStat(HashMap<String, String> map);
	public ArrayList<UsrStatVo> getMonthStat(HashMap<String, String> map);
	public ArrayList<UsrStatVo> getDayStat(HashMap<String, String> map);
	public ArrayList<UsrStatVo> getOrgzYearStat(HashMap<String, String> map);
	public ArrayList<UsrStatVo> getOrgzMonthStat(HashMap<String, String> map);
	public ArrayList<UsrStatVo> getOrgzDayStat(HashMap<String, String> map);

}
