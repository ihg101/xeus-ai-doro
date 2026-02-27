package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("covidMapper")
public interface CovidMapper {

	public int getCount(HashMap<String, String> map);


	public List<CovidVo> getList(HashMap<String, String> map);


	public CovidVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(CovidVo vo);


	public int edit(CovidVo vo);

}
