package gmx.gis.api.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper
public interface GMT_RestAPIMapper {

	public ArrayList<GMT_RestAPIVo> getList(HashMap<String, String> map);

	public GMT_RestAPIVo getItem(HashMap<String, Integer> map);

	public GMT_RestAPIVo getItemByAPIKey(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int add(GMT_RestAPIVo vo);

	public GMT_RestAPIVo addAndItem(GMT_RestAPIVo vo);

	public int edit(GMT_RestAPIVo vo);

	public int del(HashMap<String, Integer> map);

}
