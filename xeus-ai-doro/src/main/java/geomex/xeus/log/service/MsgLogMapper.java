package geomex.xeus.log.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  MsgLogMapper.java
 * 설  명 :
 *   SMS 전송 로그 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 * 2018-09-12      이은규          테이블 수정으로 인한 작업
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */
@Mapper("msgLogMapper")
public interface MsgLogMapper {

	public List<MsgLogVo> getList(HashMap<String, String> map);

	public MsgLogVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(MsgLogVo vo);

	public int edit(MsgLogVo vo);

}
