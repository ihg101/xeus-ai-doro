package geomex.xeus.sysmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import geomex.xeus.sysmgr.service.SymDescVo;

/**
 * <pre>
 * 파일명 :  SymDescMapper.java
 * 설  명 :
 *   심볼 아이콘 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 23.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 10. 23.
 * @version : 1.0
 * @see
 */
@Mapper("symDescMapper")
public interface SymDescMapper {

	public int getCount(HashMap<String, String> map);

	public List<SymDescVo> getList(HashMap<String, String> map);

	public SymDescVo getItem(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(SymDescVo vo);

	public int edit(SymDescVo vo);

}
