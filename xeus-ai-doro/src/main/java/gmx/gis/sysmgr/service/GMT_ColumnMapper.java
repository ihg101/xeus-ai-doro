package gmx.gis.sysmgr.service;

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
public interface GMT_ColumnMapper {

	public ArrayList<GMT_ColumnVo> getColumnInfo(HashMap<String, String> map);

	public ArrayList<HashMap<String, String>> getTableValues(GMT_ListHashMapVo vo);

	public int getTableCountValue(GMT_ListHashMapVo vo);

	public ArrayList<String> getDistinctValue(HashMap<String, String> map);

	public ArrayList<HashMap<String, String>> getCommonSearch(GMT_ListHashMapVo vo);

	public int getCommonSearchCount(GMT_ListHashMapVo vo);

	public ArrayList<HashMap<String, String>> getCommonSearchAreaAndLength(GMT_ListHashMapVo vo);

	public void createSearchResultLayer(GMT_ListHashMapVo vo);

	public void createSearchResultViewLayer(GMT_ListHashMapVo vo);

	public int addLayerValue(GMT_ListHashMapVo vo);

	public int editLayerValue(GMT_ListHashMapVo vo);

	public int delLayerValue(GMT_ListHashMapVo vo);

	public ArrayList<HashMap<String, String>> selectLayerValue(GMT_ListHashMapVo vo);

	public int selectLayerCount(GMT_ListHashMapVo vo);

	public List<GMT_ColumnVo> getList();

	public ArrayList<String> getAllSchemas();

	public boolean isExistsTable(HashMap<String, String> map);

	public boolean isExistsColumn(HashMap<String, String> map);

	public void addField(HashMap<String, String> map);

	public void dropField(HashMap<String, String> map);

}
