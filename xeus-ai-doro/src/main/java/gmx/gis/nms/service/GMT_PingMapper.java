package gmx.gis.nms.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 *
 * <pre>
 *
 * </pre>
 *
 * @author 이주영
 *
 */
@Mapper
public interface GMT_PingMapper {

	public ArrayList<GMT_PingVo> getList(HashMap<String, String> map);

	public GMT_PingVo getItem(HashMap<String, Integer> map);

	public GMT_PingVo getItemByKey(HashMap<String, Integer> map);

	public int getCount(HashMap<String, String> map);

	public boolean isExistsTable(HashMap<String, String> map);

	public boolean isExistsColumn(HashMap<String, String> map);

	public ArrayList<HashMap<String, String>> getIPList(HashMap<String, String> map);

	public int editStateCd(HashMap<String, String> map);

	public int add(GMT_PingVo vo);

	public GMT_PingVo addAndItem(GMT_PingVo vo);

	public int edit(GMT_PingVo vo);

	public int del(HashMap<String, Integer> map);

}
