package geomex.xeus.smartcity.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CodeMapper.java
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
 * @since   :  2017. 7. 7.
 * @version :  1.0
 * @see
 */
@Mapper("eventMapper")
public interface EventMapper {
    
	public ArrayList<EventHistVo> getList(HashMap<String, String> map) throws Exception;

	public ArrayList<EventHistVo> getEventTypeList(HashMap<String, String> map) throws Exception;

	public EventHistVo getItem(HashMap<String, String> map) throws Exception;

	public int del(HashMap<String, String> map) throws Exception;

	public int delVo(EventHistVo vo) throws Exception;

	public int add(EventHistVo vo) throws Exception;

	public int edit(EventHistVo vo) throws Exception;

	public int getCount(HashMap<String, String> map) throws Exception;

	public List<HashMap<String, String>> getStatByType(HashMap<String, String> map) throws Exception;

	public HashMap<String, String> getTodayEvtByTime(HashMap<String, String> map) throws Exception;
	
	public ArrayList<EventHistVo> checkContain(HashMap<String, String> map) throws Exception;
	
   public ArrayList<EventHistVo> getBlackIceList(HashMap<String, String> map) throws Exception;
   
   public ArrayList<EventHistVo> getRealList(HashMap<String, String> map) throws Exception;

}
