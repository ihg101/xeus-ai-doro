package gmx.gis.nms.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.sysmgr.service.GMT_ColumnMapper;

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
public class GMT_PingService extends EgovAbstractServiceImpl {

	@Autowired private GMT_PingMapper mapper;
	
	@Autowired private GMT_ColumnMapper column;

	public ArrayList<GMT_PingVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_PingVo>) mapper.getList(map);
	}

	public GMT_PingVo getItem(HashMap<String, Integer> map) throws Exception {

		return (GMT_PingVo) mapper.getItem(map);
	}

	public GMT_PingVo getItemByKey(Integer mgrSeq) throws Exception {
		HashMap<String, Integer> map = new HashMap<String, Integer>();
		map.put("mgrSeq", mgrSeq);

		return (GMT_PingVo) mapper.getItemByKey(map);
	}

	public boolean isExistsTable(String schemNm, String tblId) throws Exception {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schemNm", schemNm);
		map.put("tblId", tblId);

		return column.isExistsTable(map);
	}

	public boolean isExistsTable(String schemAndTable) throws Exception {
		String schemNm = schemAndTable.split("\\.")[0];
		String tblId = schemAndTable.split("\\.")[1];

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schemNm", schemNm);
		map.put("tblId", tblId);

		return column.isExistsTable(map);
	}

	public boolean isExistsColumn(String schemNm, String tblId, String columnNm) throws Exception {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schemNm", schemNm);
		map.put("tblId", tblId);
		map.put("columNm", columnNm);

		return column.isExistsColumn(map);
	}

	public boolean isExistsColumn(String schemAndTable, String columnNm) throws Exception {
		String schemNm = schemAndTable.split("\\.")[0];
		String tblId = schemAndTable.split("\\.")[1];

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schemNm", schemNm);
		map.put("tblId", tblId);
		map.put("columnNm", columnNm);

		return column.isExistsColumn(map);
	}

	public ArrayList<HashMap<String, String>> getIPList(String schemAndTable, String ipColumn) throws Exception {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schemAndTable", schemAndTable);
		map.put("ipColumn", ipColumn);

		return (ArrayList<HashMap<String, String>>) mapper.getIPList(map);
	}

	public boolean editStateCd(HashMap<String, String> map) throws Exception {

		int state = mapper.editStateCd(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean del(HashMap<String, Integer> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(GMT_PingVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public GMT_PingVo addAndItem(GMT_PingVo vo) throws Exception {

		return (GMT_PingVo) mapper.addAndItem(vo);
	}

	public boolean edit(GMT_PingVo vo) throws Exception {

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
