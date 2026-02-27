package gmx.gis.geometry.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.proxy.service.GMT_ProxyService;

@Service
public class GMT_GeometryService extends EgovAbstractServiceImpl {

	@Autowired private GMT_ProxyService proxy;

	@Autowired private GMT_GeometryMapper mapper;

	@PostConstruct
    public void init() throws Exception {

		ArrayList<GMT_GeometryVo> list = (ArrayList<GMT_GeometryVo>) this.getList(null);

		for(int i=0; i<list.size(); i++){
			String mode = "add";
			String schema = list.get(i).getfTableSchema();
			String table = list.get(i).getfTableName();
			String layerNm = list.get(i).getLyrNm();

			proxy.manageLayer(mode, schema, table, layerNm);
		}
    }

	public ArrayList<GMT_GeometryVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_GeometryVo>) mapper.getList(map);
	}

	public GMT_GeometryVo getItem(HashMap<String, String> map) throws Exception {

		return (GMT_GeometryVo) mapper.getItem(map);
	}

	public String getNextPrimaryKey(HashMap<String, String> map) throws Exception {

		return mapper.getNextPrimaryKey(map);
	}

}
