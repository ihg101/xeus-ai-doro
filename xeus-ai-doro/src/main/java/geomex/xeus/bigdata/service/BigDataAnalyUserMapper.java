package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataAnalyUserMapper")
public interface BigDataAnalyUserMapper {

	public int getCount(HashMap<String, String> map);


	public List<BigDataAnalyUserVo> getList(HashMap<String, String> map);


	public BigDataAnalyUserVo getItem(HashMap<String, String> map);


	public void createPointTable(HashMap<String, String> map);


	public void createPolygonTable(HashMap<String, String> map);


	public void dropTable(String val);


	public int del(HashMap<String, String> map);


	public int delByVo(BigDataAnalyUserVo vo);


	public int add(BigDataAnalyUserVo vo);


	public int edit(BigDataAnalyUserVo vo);


}
