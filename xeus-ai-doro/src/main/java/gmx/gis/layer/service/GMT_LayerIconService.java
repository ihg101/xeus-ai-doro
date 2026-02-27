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
public class GMT_LayerIconService extends EgovAbstractServiceImpl {

	@Autowired
    private GMT_LayerIconMapper mapper;

	public ArrayList<GMT_LayerIconVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerIconVo>) mapper.getList(map);
	}

	public GMT_LayerIconVo getItem(HashMap<String, String> map) throws Exception {

		return (GMT_LayerIconVo) mapper.getItem(map);
	}

	public boolean del(String mgrSeq, String userId) throws Exception {

		int state = mapper.del(mgrSeq, userId);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(GMT_LayerIconVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean edit(GMT_LayerIconVo vo) throws Exception {

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
