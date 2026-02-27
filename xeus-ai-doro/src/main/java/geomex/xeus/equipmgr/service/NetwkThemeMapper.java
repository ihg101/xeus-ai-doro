package geomex.xeus.equipmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  NetwkThemeMapper.java
 * 설  명 :
 *   네트워크망 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2019-01-30      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2019. 1. 30.
 * @version :  1.0
 * @see
 */
@Mapper("netwkThemeMapper")
public interface NetwkThemeMapper {

	public int getCount(HashMap<String, String> map);

	public List<NetwkThemeVo> getList(HashMap<String, String> map);

	public NetwkThemeVo getItem(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(NetwkThemeVo vo);

	public int edit(NetwkThemeVo vo);

}
