package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.sysmgr.service.OrganizationMapper;

/**
 * <pre>
 * 파일명 :  AssetStatService.java
 * 설  명 :
 *   장비 모니터링 통계 서비스
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
@Service("assetStatService")
public class AssetStatService extends EgovAbstractServiceImpl {

	@Resource(name = "assetStatMapper")
    private AssetStatMapper mapper;

	@Resource(name = "organizationMapper")
    private OrganizationMapper orgz;

	/**
	 * 사용자 연별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetStatVo> getYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetStatVo>)mapper.getYearStat(map);
	}

	/**
	 * 사용자 월별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetStatVo> getMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetStatVo>)mapper.getMonthStat(map);
	}

	/**
	 * 사용자 일별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetStatVo> getDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetStatVo>)mapper.getDayStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetStatVo> getOrgzYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetStatVo>)mapper.getOrgzYearStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetStatVo> getOrgzMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetStatVo>)mapper.getOrgzMonthStat(map);
	}

	/**
	 * 사용자 기관별 일 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetStatVo> getOrgzDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetStatVo>)mapper.getOrgzDayStat(map);
	}

	/**
	 * 장비목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<String> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<String>)mapper.getList(map);
	}

	/**
	 * 시간대별 장비상태현황 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public String getOrgzDayCnt(HashMap<String, String> map) throws Exception {

		return mapper.getOrgzDayCnt(map);
	}

}
