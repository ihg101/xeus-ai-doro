package gmx.gis.layer.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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
public interface GMT_LayerGroupMapper {

	public ArrayList<GMT_LayerGroupVo> getList(HashMap<String, String> map);

	public ArrayList<GMT_LayerGroupVo> getListExceptTempLyrGrp(HashMap<String, String> map);

	public GMT_LayerGroupVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int add(GMT_LayerGroupVo vo);

	public int edit(GMT_LayerGroupVo vo);

	public int del(HashMap<String, String> map);

	public int setLayerGroupIndex(List<HashMap<String, Object>> list);
}
