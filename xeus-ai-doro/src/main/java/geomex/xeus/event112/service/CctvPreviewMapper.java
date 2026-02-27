package geomex.xeus.event112.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper
public interface CctvPreviewMapper {

	public int getCount(HashMap<String, String> map);


	public List<CctvPreviewVo> getList(HashMap<String, String> map);


	public CctvPreviewVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(CctvPreviewVo vo);


	public int edit(CctvPreviewVo vo);


	public int editDocSendYn(HashMap<String, List<String>> map);


}
