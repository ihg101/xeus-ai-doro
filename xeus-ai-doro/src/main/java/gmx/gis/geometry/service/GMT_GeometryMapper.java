package gmx.gis.geometry.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 *
 * <pre>
 * geometry_columns 테이블 관리를 위한 Mapper 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Mapper
public interface GMT_GeometryMapper {

	public ArrayList<GMT_GeometryVo> getList(HashMap<String, String> map);

	public GMT_GeometryVo getItem(HashMap<String, String> map);

	public String getNextPrimaryKey(HashMap<String, String> map);

}
