package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.sysmgr.service.OrganizationMapper;

/**
 * <pre>
 * 파일명 :  EvtCctvStatService.java
 * 설  명 :
 *   이벤트별 CCTV 영상조회 통계 서비스
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
@Service("evtCctvStatService")
public class EvtCctvStatService extends EgovAbstractServiceImpl {

	@Resource(name = "evtCctvStatMapper")
    private EvtCctvStatMapper mapper;

	@Resource(name = "organizationMapper")
    private OrganizationMapper orgz;

	/**
	 * 사용자 연별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EvtCctvStatVo> getYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<EvtCctvStatVo>)mapper.getYearStat(map);
	}

	/**
	 * 사용자 월별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EvtCctvStatVo> getMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<EvtCctvStatVo>)mapper.getMonthStat(map);
	}

	/**
	 * 사용자 일별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EvtCctvStatVo> getDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<EvtCctvStatVo>)mapper.getDayStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EvtCctvStatVo> getOrgzYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<EvtCctvStatVo>)mapper.getOrgzYearStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EvtCctvStatVo> getOrgzMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<EvtCctvStatVo>)mapper.getOrgzMonthStat(map);
	}

	/**
	 * 사용자 기관별 일 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EvtCctvStatVo> getOrgzDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<EvtCctvStatVo>)mapper.getOrgzDayStat(map);
	}

	/**
	 * 시간대별 CCTV 조회 현황 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, String> getTodayCctvByTime(HashMap<String, String> map) throws Exception {

		return mapper.getTodayCctvByTime(map);
	}

}
