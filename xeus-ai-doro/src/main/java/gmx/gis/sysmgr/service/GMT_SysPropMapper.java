package gmx.gis.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
//import gmx.gis.sysmgr.service.GMT_SysPropVo;

/**
 * <pre>
 * 파일명 :  GMT_SysPropMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 26.      이은규          최초 생성
 * 2019. 08. 06.	  이은규		  tvius >> sysmgr 패키지로 이동.
 *
 * </pre>
 *
 * @since  : 2017. 10. 26.
 * @version : 1.0
 * @see
 */
@Mapper
public interface GMT_SysPropMapper {

	public ArrayList<GMT_SysPropVo> getList(HashMap<String, String> map) throws Exception;

	//public ArrayList<GMT_SysPropVo> getList(HashMap<String, String> map) throws Exception;

	//public GMT_SysPropVo getItem(HashMap<String, String> map) throws Exception;

	public int del(HashMap<String, String> map) throws Exception;

	public int add(GMT_SysPropVo vo) throws Exception;

	public int edit(GMT_SysPropVo vo) throws Exception;

	public int editSysParam(GMT_SysPropVo vo) throws Exception;

	public int getCount(HashMap<String, String> map) throws Exception;

}
