package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsPrevRqstMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 26.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 10. 26.
 * @version : 1.0
 * @see
 */
@Mapper("crmsPrevRqstMapper")
public interface CrmsPrevRqstMapper {

	/*public HashMap<String, String> getHeatMap(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getRenewList(HashMap<String, String> map);*/

	public int getCount(HashMap<String, String> map);

	public List<CrmsPrevRqstVo> getList(HashMap<String, String> map);

	public int add(CrmsPrevRqstVo CrmsPrevRqstVo);

	public int update(CrmsPrevRqstVo CrmsPrevRqstVo);

	public int del(HashMap<String, String> map);

}
