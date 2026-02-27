package gmx.gis.layerTable.service;


import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * @author 민동현
 *
 */
@Mapper
public interface GMT_LayerTableMapper {

	void create(GMT_LayerTableVo vo);

	void alter(GMT_LayerTableVo vo);

	void addOneColumn(GMT_LayerTableVo vo);

	void deleteOneColumn(GMT_LayerTableVo vo);

	void drop(GMT_LayerTableVo vo);

	void insertPoint(GMT_LayerTableVo vo);

	void insertLine(GMT_LayerTableVo vo);

	void addPKey(HashMap<String, String> map);

}
