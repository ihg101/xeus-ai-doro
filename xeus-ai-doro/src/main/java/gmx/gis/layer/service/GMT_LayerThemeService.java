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
public class GMT_LayerThemeService extends EgovAbstractServiceImpl {

	@Autowired
    private GMT_LayerThemeMapper mapper;

	public ArrayList<GMT_LayerThemeVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerThemeVo>) mapper.getList(map);
	}

	public GMT_LayerThemeVo getItem(HashMap<String, String> map) throws Exception {

		return (GMT_LayerThemeVo) mapper.getItem(map);
	}

	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(GMT_LayerThemeVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	@Transactional(propagation = Propagation.REQUIRED)
	public boolean addList(List<GMT_LayerThemeVo> list) throws Exception {

		int state = mapper.addList(list);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	public boolean edit(GMT_LayerThemeVo vo) throws Exception {

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
