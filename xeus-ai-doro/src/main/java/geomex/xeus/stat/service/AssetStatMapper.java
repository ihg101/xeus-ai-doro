package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  AssetStatMapper.java
 * 설  명 :
 *   장비 모니터링 통계 Mapper
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
@Mapper("assetStatMapper")
public interface AssetStatMapper {

	public ArrayList<AssetStatVo> getYearStat(HashMap<String, String> map);
	public ArrayList<AssetStatVo> getMonthStat(HashMap<String, String> map);
	public ArrayList<AssetStatVo> getDayStat(HashMap<String, String> map);
	public ArrayList<AssetStatVo> getOrgzYearStat(HashMap<String, String> map);
	public ArrayList<AssetStatVo> getOrgzMonthStat(HashMap<String, String> map);
	public ArrayList<AssetStatVo> getOrgzDayStat(HashMap<String, String> map);
	public ArrayList<String> getList(HashMap<String, String> map);
	public String getOrgzDayCnt(HashMap<String, String> map);
}
