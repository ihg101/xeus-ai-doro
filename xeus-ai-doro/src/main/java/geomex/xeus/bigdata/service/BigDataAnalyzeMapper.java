package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataAnalyzeMapper")
public interface BigDataAnalyzeMapper {

	public int getCount(HashMap<String, String> map);


	public List<BigDataAnalyzeVo> getList(HashMap<String, String> map);


	public BigDataAnalyzeVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int delByVo(BigDataAnalyzeVo vo);


	public int add(BigDataAnalyzeVo vo);


	public int edit(BigDataAnalyzeVo vo);


	public List<HashMap<String, String>> getWfs(HashMap<String, String> map);

}
