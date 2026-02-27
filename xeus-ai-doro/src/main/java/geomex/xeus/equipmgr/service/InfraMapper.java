package geomex.xeus.equipmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  StatusMapper.java
 * 설  명 :
 *   상태 관리 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Mapper("infraMapper")
public interface InfraMapper {

	public int getCount(HashMap<String, String> map);


	public List<InfraVo> getList(HashMap<String, String> map);


	public List<InfraVo> getInfraTheme(HashMap<String, String> map);


	public List<String> getBlackBoxTheme(HashMap<String, String> map);


	public List<String> getLoraStateTheme(HashMap<String, String> map);


	public InfraVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(InfraVo vo);


	public int edit(InfraVo vo);

}
