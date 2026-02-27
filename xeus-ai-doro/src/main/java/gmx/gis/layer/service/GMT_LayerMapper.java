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
public interface GMT_LayerMapper {

	public ArrayList<GMT_LayerVo> getList(HashMap<String, String> map);

	public ArrayList<GMT_LayerVo> getShareList(HashMap<String, String> map);

	public boolean setStyle(GMT_StyleVo vo);

	public GMT_LayerVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int add(GMT_LayerVo vo);

	public int edit(GMT_LayerVo vo);

	public int editGrpMgrSeq(GMT_LayerVo vo);

	public int setLayersIndex(List<HashMap<String, Object>> list);

	public int del(HashMap<String, String> map);

	public void dropTable(HashMap<String, String> map);

	public void dropViewTable(HashMap<String, String> map);

	public GMT_LayerVo addAndgetItem(GMT_LayerVo vo);

	public int delExcelLayer(GMT_LayerVo vo);

	public ArrayList<GMT_LayerVo> getLayerListByAuth(HashMap<String, String> map);

}
