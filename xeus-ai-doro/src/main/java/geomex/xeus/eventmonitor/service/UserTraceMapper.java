package geomex.xeus.eventmonitor.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  UserTraceMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-01-26      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 01. 26.
 * @version :  1.0
 * @see
 */
@Mapper("userTraceMapper")
public interface UserTraceMapper {

    public int getCount(HashMap<String, String> map);


    public List<UserTraceVo> getList(HashMap<String, String> map);


    public UserTraceVo getItem(HashMap<String, String> map);


    public int del(HashMap<String, String> map);


    public int add(UserTraceVo vo);


    public int edit(UserTraceVo vo);

}
