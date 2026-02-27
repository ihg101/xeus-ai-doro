package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsPrevAviMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 27.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 10. 27.
 * @version : 1.0
 * @see
 */
@Mapper("crmsPrevAviMapper")
public interface CrmsPrevAviMapper {

	public int getCount(HashMap<String, String> map);

	public List<CrmsPrevAviVo> getList(HashMap<String, String> map);

	public int add(CrmsPrevAviVo CrmsPrevAviVo);

	public int update(CrmsPrevAviVo CrmsPrevAviVo);

	public int del(HashMap<String, String> map);

}
