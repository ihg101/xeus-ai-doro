package gmx.gis.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  GMT_AuthMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since : 2017. 6. 22.
 * @version : 1.0
 * @see
 */
@Mapper
public interface GMT_AuthMapper {


    public int hasAuth(HashMap<String, String> map) throws Exception;

    public ArrayList<GMT_AuthVo> getList(HashMap<String, String> map) throws Exception;

    public GMT_AuthVo getItem(HashMap<String, String> map) throws Exception;

    public int getCount(HashMap<String, String> map) throws Exception;

    public ArrayList<GMT_AuthGrpVo> getGrpList(HashMap<String, String> map) throws Exception;

    public int getGrpCount(HashMap<String, String> map) throws Exception;

    public ArrayList<GMT_AuthGrpVo> getAuthGrpList(HashMap<String, String> map) throws Exception;

    public int getAuthGrpCount(HashMap<String, String> map) throws Exception;

    public int editGrp(GMT_AuthGrpVo vo);

    public int delGrp(HashMap<String, String> map) throws Exception;

    public int delGrpAuth(HashMap<String, String> map) throws Exception;

	public int delAuthLayerList(HashMap<String, String> map);

    public int addGrp(GMT_AuthGrpVo vo) throws Exception;

    public int addGrpAuth(GMT_AuthGrpVo vo) throws Exception;

	public int addAuthLayerList(HashMap<String, String> map) throws Exception;

	public int addAuthLayerListMultiple(List<HashMap<String, Object>> list) throws Exception;

	public int updateAuthLayerByTabAuth(HashMap<String, String> map) throws Exception;



}
