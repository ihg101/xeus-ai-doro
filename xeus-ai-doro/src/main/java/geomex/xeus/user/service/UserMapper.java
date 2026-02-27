package geomex.xeus.user.service;

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
@Mapper("userMapper")
public interface UserMapper {

	public int getCount(HashMap<String, String> map);


	public List<UserVo> getList(HashMap<String, String> map);


	public UserVo getItem(HashMap<String, String> map);


	public List<UserVo> getAgeStat(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(UserVo vo);


	public int edit(UserVo vo);


	public int editBoardInfo(HashMap<String, String> map);

	public int editPassword(HashMap<String, String> map);

	public int editPasswordAdmin(HashMap<String, String> map);

	public int editAuthAtmtCnt(HashMap<String, String> map);

	public int editPledge(HashMap<String, String> map);

}
