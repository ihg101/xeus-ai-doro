package geomex.xeus.event112.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper
public interface CctvPreviewDocMapper {

	public int getCount(HashMap<String, String> map);


	public List<CctvPreviewDocVo> getList(HashMap<String, String> map);


	public CctvPreviewDocVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(CctvPreviewDocVo vo);


	public int edit(CctvPreviewDocVo vo);

}
