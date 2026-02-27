package gmx.gis.layer.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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
public class GMT_LayerGroupService extends EgovAbstractServiceImpl {

	@Autowired
    private GMT_LayerGroupMapper mapper;

	public ArrayList<GMT_LayerGroupVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerGroupVo>) mapper.getList(map);
	}

	public ArrayList<GMT_LayerGroupVo> getListExceptTempLyrGrp(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerGroupVo>) mapper.getListExceptTempLyrGrp(map);
	}

	public GMT_LayerGroupVo getItem(HashMap<String, String> map) throws Exception {

		return (GMT_LayerGroupVo) mapper.getItem(map);
	}

	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(GMT_LayerGroupVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean edit(GMT_LayerGroupVo vo) throws Exception {

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

	@Transactional(propagation = Propagation.REQUIRED)
	public boolean setLayerGroupIndex(List<HashMap<String, Object>> list) throws Exception {

		int state = mapper.setLayerGroupIndex(list);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

}
