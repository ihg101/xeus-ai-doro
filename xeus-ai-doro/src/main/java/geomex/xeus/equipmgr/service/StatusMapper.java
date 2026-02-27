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
@Mapper("statusMapper")
public interface StatusMapper {

	public int getCount(HashMap<String, String> map);


	public List<StatusVo> getList(HashMap<String, String> map);


	public StatusVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(StatusVo vo);


	public int edit(StatusVo vo);

}
