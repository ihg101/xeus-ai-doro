package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import geomex.xeus.sysmgr.service.SysPropVo;

/**
 * <pre>
 * 파일명 :  SysPropMapper.java
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
@Mapper("smsAuthMapper")
public interface SmsAuthMapper {

	public ArrayList<SmsAuthVo> getList(HashMap<String, String> map) throws Exception;

	public int del(HashMap<String, String> map) throws Exception;

	public int add(SmsAuthVo vo) throws Exception;

	public int edit(HashMap<String, String> map) throws Exception;

}
