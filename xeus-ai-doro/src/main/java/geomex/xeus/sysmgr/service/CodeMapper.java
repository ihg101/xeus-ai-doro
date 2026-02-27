package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

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
@Mapper("codeMapper")
public interface CodeMapper {

	public ArrayList<CodeVo> getList(HashMap<String, String> map) throws Exception;

	public CodeVo getItem(HashMap<String, String> map) throws Exception;

	public int del(HashMap<String, String> map) throws Exception;

	public int add(CodeVo vo) throws Exception;

	public int edit(CodeVo vo) throws Exception;

	public int getCount(HashMap<String, String> map) throws Exception;

}
