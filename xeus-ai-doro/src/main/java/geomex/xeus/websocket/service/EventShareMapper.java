package geomex.xeus.websocket.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  UserMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 * 2019-04-01	   이은규		   서약서 수정 메소드 추가
 *
 * </pre>
 *
 * @since   :  2017. 5. 31.
 * @version :  1.0
 * @see
 */
@Mapper("eventShareMapper")
public interface EventShareMapper {

	public int getCount(HashMap<String, String> map);


	public List<EventShareVo> getList(HashMap<String, String> map);


	public EventShareVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(EventShareVo vo);


	public int edit(EventShareVo vo);

}
