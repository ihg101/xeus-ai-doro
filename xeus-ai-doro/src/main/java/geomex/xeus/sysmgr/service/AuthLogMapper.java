package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  AuthLogMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-10-17      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 10. 17.
 * @version : 1.0
 * @see
 */
@Mapper("authLogMapper")
public interface AuthLogMapper {

    public ArrayList<AuthLogVo> getList(HashMap<String, String> map);

    public AuthLogVo getItem(HashMap<String, String> map);

    public int getCount(HashMap<String, String> map);

    public int del(HashMap<String, String> map);

    public int add(AuthLogVo vo);

    public int edit(AuthLogVo vo);

}
