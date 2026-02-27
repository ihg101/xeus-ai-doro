package geomex.xeus.sysmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import geomex.xeus.sysmgr.service.SymIconVo;

/**
 * <pre>
 * 파일명 :  SymIconMapper.java
 * 설  명 :
 *   심볼 아이콘 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 06. 29.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 06. 29.
 * @version : 1.0
 * @see
 */
@Mapper("symIconMapper")
public interface SymIconMapper {

	public int getCount(HashMap<String, String> map);

	public List<SymIconVo> getList(HashMap<String, String> map);

	public SymIconVo getItem(HashMap<String, String> map);

	public List<SymIconVo> chkDelList(HashMap<String, List<String>> map);

	public int del(HashMap<String, String> map);

	public int add(SymIconVo vo);

	public int edit(SymIconVo vo);

}
