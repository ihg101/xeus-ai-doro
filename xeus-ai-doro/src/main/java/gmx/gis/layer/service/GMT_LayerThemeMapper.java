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
public interface GMT_LayerThemeMapper {

	public ArrayList<GMT_LayerThemeVo> getList(HashMap<String, String> map);

	public GMT_LayerThemeVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int add(GMT_LayerThemeVo vo);

	public int addList(List<GMT_LayerThemeVo> list);

	public int edit(GMT_LayerThemeVo vo);

	public int del(HashMap<String, String> map);

}
