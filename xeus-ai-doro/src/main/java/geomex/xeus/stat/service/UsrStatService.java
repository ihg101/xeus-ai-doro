package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.sysmgr.service.OrganizationMapper;

/**
 * <pre>
 * 파일명 :  UsrStatService.java
 * 설  명 :
 *   사용자 접속통계 서비스
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
@Service("usrStatService")
public class UsrStatService extends EgovAbstractServiceImpl {

	@Resource(name = "usrStatMapper")
    private UsrStatMapper mapper;

	@Resource(name = "organizationMapper")
    private OrganizationMapper orgz;

	/**
	 * 사용자 연별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UsrStatVo> getYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<UsrStatVo>)mapper.getYearStat(map);
	}

	/**
	 * 사용자 월별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UsrStatVo> getMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<UsrStatVo>)mapper.getMonthStat(map);
	}

	/**
	 * 사용자 일별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UsrStatVo> getDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<UsrStatVo>)mapper.getDayStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UsrStatVo> getOrgzYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<UsrStatVo>)mapper.getOrgzYearStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UsrStatVo> getOrgzMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<UsrStatVo>)mapper.getOrgzMonthStat(map);
	}

	/**
	 * 사용자 기관별 일 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UsrStatVo> getOrgzDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<UsrStatVo>)mapper.getOrgzDayStat(map);
	}

}
