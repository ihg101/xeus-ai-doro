package geomex.xeus.smartcity.service;

import java.util.ArrayList;
import java.util.HashMap;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 *
 * <pre>
 * WASS Mapper
 * </pre>
 *
 * @author 이주영
 *
 */
@Mapper
public interface WassMapper {

	public ArrayList<WassVo> getList(HashMap<String, Object> map) throws Exception;

	public WassVo getItem(HashMap<String, Object> map) throws Exception;

	public int getCount(HashMap<String, Object> map) throws Exception;

	public int del(HashMap<String, Object> map) throws Exception;

	public int add(WassVo vo) throws Exception;

	public int edit(WassVo vo) throws Exception;

}
