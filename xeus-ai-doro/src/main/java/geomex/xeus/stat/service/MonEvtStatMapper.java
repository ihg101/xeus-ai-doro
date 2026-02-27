package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import geomex.xeus.smartcity.service.EventHistVo;

/**
 * <pre>
 * 파일명 :  MonEvtStatMapper.java
 * 설  명 :
 *   이벤트 모니터링 통계 Mapper
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
@Mapper("monEvtStatMapper")
public interface MonEvtStatMapper {

	public ArrayList<MonEvtStatVo> getYearStat(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getMonthStat(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getDayStat(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getOrgzYearStat(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getOrgzMonthStat(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getOrgzDayStat(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getEventStatByEvtNm(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getEventStatByEmdCd(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getEventStatByEvtTypCdAndEvtNm(HashMap<String, String> map);
	public ArrayList<MonEvtStatVo> getEventStatByEvtTypCd(HashMap<String, String> map);


	public String getOrgzDayCnt(HashMap<String, String> map);

	public ArrayList<String> getEvtList(HashMap<String, String> map);

	public ArrayList<EventHistVo> getList(HashMap<String, String> map) throws Exception;
	public EventHistVo getItem(HashMap<String, String> map) throws Exception;
	public int getCount(HashMap<String, String> map) throws Exception;

	public ArrayList<EventHistVo> getDistinctEvtTypCd(HashMap<String, String> map) throws Exception;
}


