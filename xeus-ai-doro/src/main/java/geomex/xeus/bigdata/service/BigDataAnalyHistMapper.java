package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("bigDataAnalyHistMapper")
public interface BigDataAnalyHistMapper {

    public int getCount(HashMap<String, String> map);

    public List<BigDataAnalyHistVo> getList(HashMap<String, String> map);

    public BigDataAnalyHistVo getItem(HashMap<String, String> map);

    public int del(HashMap<String, String> map);

    public int add(BigDataAnalyHistVo vo);

    public int edit(BigDataAnalyHistVo vo);

   // public List<HashMap<String, String>> getWfs(HashMap<String, String> map);

}
