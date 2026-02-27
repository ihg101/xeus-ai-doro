package geomex.xeus.equipmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  NetwkMapper.java
 * 설  명 :
 *   네트워크망 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-09-13      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 9. 13.
 * @version :  1.0
 * @see
 */
@Mapper("netwkMapper")
public interface NetwkMapper {

	public int getCount(HashMap<String, String> map);


	public List<NetwkVo> getList(HashMap<String, String> map);


	public List<NetwkVo> getNmsCableTheme(HashMap<String, String> map);


	public List<NetwkVo> getFnmsCableTheme(HashMap<String, String> map);


	public NetwkVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(NetwkVo vo);


	public int edit(NetwkVo vo);


	public int editThemeColor(NetwkVo vo);

}
