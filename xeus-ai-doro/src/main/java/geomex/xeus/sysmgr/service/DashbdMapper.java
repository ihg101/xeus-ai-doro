package geomex.xeus.sysmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import geomex.xeus.sysmgr.service.SymIconVo;

/**
 * <pre>
 * 파일명 :  DashbdMapper.java
 * 설  명 :
 *   대시보드 목록 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 11. 06.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 11. 06.
 * @version : 1.0
 * @see
 */
@Mapper("dashbdMapper")
public interface DashbdMapper {

	public int getCount(HashMap<String, String> map);

	public List<DashbdVo> getList(HashMap<String, String> map);

	public DashbdVo getItem(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(DashbdVo vo);

	public int edit(DashbdVo vo);

	public float getNetwkOperatingRate(HashMap<String, String> map);

	public DashbdVo getEquipCnt(HashMap<String, String> map);

}
