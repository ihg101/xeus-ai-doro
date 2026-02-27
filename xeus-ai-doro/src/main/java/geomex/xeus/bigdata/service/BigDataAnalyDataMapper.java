package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataAnalyDataMapper")
public interface BigDataAnalyDataMapper {

	public int getCount(HashMap<String, String> map);


	public List<BigDataAnalyDataVo> getList(HashMap<String, String> map);


	public HashMap<String, String> getTableName(HashMap<String, String> map);


	public BigDataAnalyDataVo getItem(HashMap<String, String> map);


	public BigDataAnalyDataVo getItemByVo(BigDataAnalyDataVo vo);


	public int del(HashMap<String, String> map);


	public void dropTable(String val);


	public int delByVo(BigDataAnalyDataVo vo);


	public int add(BigDataAnalyDataVo vo);


	public int edit(BigDataAnalyDataVo vo);


	public int editLayerId(HashMap<String, String> map);

}
