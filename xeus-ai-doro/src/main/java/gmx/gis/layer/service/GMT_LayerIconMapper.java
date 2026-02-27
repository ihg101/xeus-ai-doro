package gmx.gis.layer.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Param;

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
public interface GMT_LayerIconMapper {

	public ArrayList<GMT_LayerIconVo> getList(HashMap<String, String> map);

	public GMT_LayerIconVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int add(GMT_LayerIconVo vo);

	public int edit(GMT_LayerIconVo vo);

	public int del(@Param("mgrSeq") String mgrSeq, @Param("userId") String userId);

}
