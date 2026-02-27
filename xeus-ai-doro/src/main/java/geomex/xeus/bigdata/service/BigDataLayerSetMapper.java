package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataLayerSetMapper")
public interface BigDataLayerSetMapper {

	public int getCount(HashMap<String, String> map);


	public List<BigDataLayerSetVo> getList(HashMap<String, String> map);


	public BigDataLayerSetVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int delByVo(BigDataLayerSetVo vo);


	public int add(BigDataLayerSetVo vo);


	public int edit(BigDataLayerSetVo vo);

}
