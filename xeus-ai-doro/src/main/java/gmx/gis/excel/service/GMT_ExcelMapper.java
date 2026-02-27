package gmx.gis.excel.service;


import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * @author 민동현
 *
 */
@Mapper
public interface GMT_ExcelMapper {

	void create(GMT_ExcelVo vo);

	void drop(GMT_ExcelVo vo);

	void insertPoint(GMT_ExcelVo vo);

	void insertLine(GMT_ExcelVo vo);

}
