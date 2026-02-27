package geomex.xeus.equipmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("patrolMapper")
public interface PatrolMapper {

	public int getCount(HashMap<String, String> map);


	public List<PatrolVo> getList(HashMap<String, String> map);


	public PatrolVo getItem(HashMap<String, String> map);


	public PatrolVo getItemByVo(PatrolVo vo);


	public int del(HashMap<String, String> map);


	public int add(PatrolVo vo);


	public int edit(PatrolVo vo);

}
