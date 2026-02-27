package gmx.gis.layer.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 *
 * <pre>
 *
 * </pre>
 *
 * @author 이주영
 *
 */
@Service
public class GMT_LayerStyleService extends EgovAbstractServiceImpl {

	@Autowired
    private GMT_LayerStyleMapper mapper;

	public ArrayList<GMT_LayerStyleVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerStyleVo>) mapper.getList(map);
	}

	public GMT_LayerStyleVo getItem(HashMap<String, String> map) throws Exception {

		return (GMT_LayerStyleVo) mapper.getItem(map);
	}

	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(GMT_LayerStyleVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean edit(GMT_LayerStyleVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

}
