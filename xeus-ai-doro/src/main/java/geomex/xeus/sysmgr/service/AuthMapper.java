package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  AuthMapper.java
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
@Mapper("authMapper")
public interface AuthMapper {

    /**
     * userID가 authData에 해당하는 권한이 있은지 조회 by khkim 2018,04.27
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int hasAuth(HashMap<String, String> map) throws Exception;

    /**
     * 권한 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<AuthVo> getList(HashMap<String, String> map) throws Exception;

    /**
     * 권한 단건을 조회합니다. (여러가지 조건을 사용합니다.)
     *
     * @param map
     * @return
     * @throws Exception
     */
    public AuthVo getItem(HashMap<String, String> map) throws Exception;

    /**
     * 권한 수를 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int getCount(HashMap<String, String> map) throws Exception;

    /**
     * 그룹 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<AuthGrpVo> getGrpList(HashMap<String, String> map) throws Exception;

    /**
     * 그룹 수를 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int getGrpCount(HashMap<String, String> map) throws Exception;

    /**
     * 그룹 권한 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<AuthGrpVo> getAuthGrpList(HashMap<String, String> map) throws Exception;

    /**
     * 그룹 권한 수를 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int getAuthGrpCount(HashMap<String, String> map) throws Exception;


    /**
     * 해당 권한그룹에 대응하는 권한 리스트를 조회합니다
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<AuthGrpVo> getAuthListByAuthGrpNo(HashMap<String, String> map) throws Exception;

    /**
     * 권한 명을 수정합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int editGrp(AuthGrpVo vo);

    /**
     * 그룹을 제거합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int delGrp(HashMap<String, String> map) throws Exception;

    /**
     * 그룹 권한을 제거합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int delGrpAuth(HashMap<String, String> map) throws Exception;

    /**
     * 그룹을 추가합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public int addGrp(AuthGrpVo vo) throws Exception;

    /**
     * 그룹 권한을 추가합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public int addGrpAuth(AuthGrpVo vo) throws Exception;

	public int delAuthLayerList(HashMap<String, String> map);

	public int addAuthLayerList(HashMap<String, String> map) throws Exception;

	public int updateAuthLayerByTabAuth(HashMap<String, String> map) throws Exception;

}
