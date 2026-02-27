package geomex.xeus.sysmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("smsMapper")
public interface SmsMapper {

	public int getCount(HashMap<String, String> map);


	public List<SmsTempVo> getList(HashMap<String, String> map);


	public SmsTempVo getItem(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int delByID(HashMap<String, String> map);


	public int add(SmsTempVo vo);


	public int edit(SmsTempVo vo);

}
