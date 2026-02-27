package geomex.xeus.equipmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("vmsMapper")
public interface VmsMapper {

	public int getCount(HashMap<String, String> map);


	public List<VmsVo> getList(HashMap<String, String> map);


	public VmsVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(VmsVo vo);


	public int edit(VmsVo vo);

}
