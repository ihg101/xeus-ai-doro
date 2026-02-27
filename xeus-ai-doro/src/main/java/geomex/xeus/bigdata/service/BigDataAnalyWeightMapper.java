package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataAnalyWeightMapper")
public interface BigDataAnalyWeightMapper {

	public int getCount(HashMap<String, String> map);


	public List<BigDataAnalyWeightVo> getList(HashMap<String, String> map);


	public BigDataAnalyWeightVo getItem(HashMap<String, String> map);


	public void createWeightTable(String val);


	public void dropTable(String val);


	public int del(HashMap<String, String> map);


	public int delByVo(BigDataAnalyWeightVo vo);


	public int add(BigDataAnalyWeightVo vo);


	public int edit(BigDataAnalyWeightVo vo);

}
