package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataAnalyzeResultMapper")
public interface BigDataAnalyzeResultMapper {

	public int getCount(HashMap<String, String> map);


	public List<BigDataAnalyzeResultVo> getList(HashMap<String, String> map);


	public List<BigDataAnalyzeResultVo> getDetailResultList(HashMap<String, String> map);


	public HashMap<String, String> getMinMax(HashMap<String, String> map);


	public BigDataAnalyzeResultVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int delByVo(BigDataAnalyzeResultVo vo);


	public int add(BigDataAnalyzeResultVo vo);


	public int edit(BigDataAnalyzeResultVo vo);


	public void dropTable(String val);


}
