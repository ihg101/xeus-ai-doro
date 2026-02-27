package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  EvtCctvStatMapper.java
 * 설  명 :
 *   이벤트별 CCTV 영상조회 통계 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-11-02      최환주          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 10. 30.
 * @version :  1.0
 * @see
 */
@Mapper("evtCctvStatMapper")
public interface EvtCctvStatMapper {

	public ArrayList<EvtCctvStatVo> getYearStat(HashMap<String, String> map);
	public ArrayList<EvtCctvStatVo> getMonthStat(HashMap<String, String> map);
	public ArrayList<EvtCctvStatVo> getDayStat(HashMap<String, String> map);
	public ArrayList<EvtCctvStatVo> getOrgzYearStat(HashMap<String, String> map);
	public ArrayList<EvtCctvStatVo> getOrgzMonthStat(HashMap<String, String> map);
	public ArrayList<EvtCctvStatVo> getOrgzDayStat(HashMap<String, String> map);
	public HashMap<String, String> getTodayCctvByTime(HashMap<String, String> map);

}
