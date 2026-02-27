package gmx.gis.layer.service;

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
public interface GMT_LayerStyleMapper {

	public ArrayList<GMT_LayerStyleVo> getList(HashMap<String, String> map);

	public GMT_LayerStyleVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int add(GMT_LayerStyleVo vo);

	public int edit(GMT_LayerStyleVo vo);

	public int del(HashMap<String, String> map);

}
