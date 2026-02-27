package geomex.xeus.bigdata.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("cctvInstallMapper")
public interface CctvInstallMapper {

	public int getCount(HashMap<String, String> map);


	public List<CctvInstallVo> getList(HashMap<String, String> map);


	public List<CctvInstallVo> getInstYearList(HashMap<String, String> map);


	public CctvInstallVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int delByVo(CctvInstallVo vo);


	public CctvInstallVo add(CctvInstallVo vo);


	public int addExcel(CctvInstallVo vo);


	public int edit(CctvInstallVo vo);

}
