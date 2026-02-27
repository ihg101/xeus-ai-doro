package geomex.xeus.sysmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import geomex.xeus.sysmgr.service.LyrSymVo;

/**
 * <pre>
 * 파일명 :  LyrSymMapper.java
 * 설  명 :
 *   심볼 아이콘 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 24.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 10. 24.
 * @version : 1.0
 * @see
 */
@Mapper("lyrSymMapper")
public interface LyrSymMapper {

	public int getCount(HashMap<String, String> map);

	public List<LyrSymVo> getList(HashMap<String, String> map);

	public LyrSymVo getItem(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(LyrSymVo vo);

	public int edit(LyrSymVo vo);

}
