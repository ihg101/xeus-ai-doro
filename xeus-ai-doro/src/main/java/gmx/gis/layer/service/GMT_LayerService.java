package gmx.gis.layer.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONObject;
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
public class GMT_LayerService extends EgovAbstractServiceImpl {

	@Autowired private GMT_LayerMapper mapper;

	@Autowired private GMT_LayerGroupMapper group;

	@Autowired private GMT_LayerStyleMapper style;

	@Autowired private GMT_LayerThemeMapper theme;

	/**
	 * <pre>
	 * 로그인한 아이디의 권한에 대응하는 레이어를 가져옵니다.
	 * <b style="color:red;">
	 * 하드코딩된 그룹 번호(mgr_seq)가 있으니 유의하세요.
	 *
	 * 예시) map.put("grpMgrSeq", "3"); <- 공유레이어 그룹
	 * </b>
	 * </pre>
	 *
	 * @param mgrSeq
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public JSONObject getLayerInfo(String mgrSeq, String userId, String tabName, String useYn) throws Exception {

		JSONObject result = new JSONObject();

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", mgrSeq);
		map.put("userId", userId);
		map.put("tabName", tabName);
		map.put("useYn", useYn);
		//권한이 있는 모든 레이어 + 나의 레이어
		ArrayList<GMT_LayerVo> layerList = mapper.getList(map);

		map.remove("mgrSeq");

		ArrayList<GMT_LayerGroupVo> groupList = group.getList(null);
		ArrayList<GMT_LayerStyleVo> styleList = style.getList(null);
		ArrayList<GMT_LayerThemeVo> themeList = theme.getList(null);

		for(int i=0; i<layerList.size(); i++){

			GMT_LayerVo layerVo = layerList.get(i);

			if(layerVo.isUseYn()){

				int lyrMgrSeq = layerVo.getMgrSeq();
				int grpMgrSeq = layerVo.getGrpMgrSeq();

				JSONObject item = new JSONObject();
				item.put("layer", layerVo);

				for(GMT_LayerGroupVo vo : groupList){
					if(grpMgrSeq == vo.getMgrSeq()){
						item.put("group", vo);
						break;
					}
				}

				for(GMT_LayerStyleVo vo : styleList){
					if(lyrMgrSeq == vo.getLyrMgrSeq()){
						item.put("style", vo);
						break;
					}
				}

				ArrayList<GMT_LayerThemeVo> layerThemeList = new ArrayList<GMT_LayerThemeVo>();
				for(GMT_LayerThemeVo vo : themeList){
					if(lyrMgrSeq == vo.getLyrMgrSeq()){
						layerThemeList.add(vo);
					}
				}
				item.put("theme", layerThemeList);

				result.put(layerVo.getTblId(), item);
			}

		}

		map.put("userId", userId);
		map.put("grpMgrSeq", "3");	//db에는 공유레이어도 grp_seq는 3으로 되어있다.
		//공유 레이어
		ArrayList<GMT_LayerVo> shareLayerList = mapper.getShareList(map);

		for(int i=0; i<shareLayerList.size(); i++){

			GMT_LayerVo layerVo = shareLayerList.get(i);

			if(layerVo.isUseYn()){

				int lyrMgrSeq = layerVo.getMgrSeq();
				int grpMgrSeq = 4;

				JSONObject item = new JSONObject();
				item.put("layer", layerVo);

				for(GMT_LayerGroupVo vo : groupList){
					if(grpMgrSeq == vo.getMgrSeq()){
						item.put("group", vo);
						break;
					}
				}

				for(GMT_LayerStyleVo vo : styleList){
					if(lyrMgrSeq == vo.getLyrMgrSeq()){
						item.put("style", vo);
						break;
					}
				}

				ArrayList<GMT_LayerThemeVo> layerThemeList = new ArrayList<GMT_LayerThemeVo>();
				for(GMT_LayerThemeVo vo : themeList){
					if(lyrMgrSeq == vo.getLyrMgrSeq()){
						layerThemeList.add(vo);
					}
				}
				item.put("theme", layerThemeList);

				result.put(layerVo.getTblId(), item);
			}

		}


		return result;
	}

	public boolean setStyle(GMT_StyleVo vo) throws Exception {


		int layerCnt = mapper.edit(vo.getLayer());
		int styleCnt = style.edit(vo.getStyle());

		HashMap<String, String> key = new HashMap<String, String>();
		key.put("lyrMgrSeq", Integer.toString(vo.getLayer().getMgrSeq()));

		theme.del(key);
		if(vo.getTheme() != null){
			if(vo.getTheme().size() > 0){

				theme.addList(vo.getTheme());
			}
		}

		if(layerCnt > 0 && styleCnt > 0){
			return true;
		}else{
			return false;
		}

	}

	public ArrayList<GMT_LayerVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerVo>) mapper.getList(map);
	}

	public GMT_LayerVo getItem(HashMap<String, String> map) throws Exception {

		return (GMT_LayerVo) mapper.getItem(map);
	}

	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean dropTable(HashMap<String, String> map) throws Exception {

		try{
			mapper.dropTable(map);
			return true;
		}catch(Exception e){
			return false;
		}

	}

	public boolean dropViewTable(HashMap<String, String> map) throws Exception {

		try{
			mapper.dropViewTable(map);
			return true;
		}catch(Exception e){
			return false;
		}

	}

	public boolean add(GMT_LayerVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean edit(GMT_LayerVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean editGrpMgrSeq(GMT_LayerVo vo) throws Exception {

		int state = mapper.editGrpMgrSeq(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	@Transactional(propagation = Propagation.REQUIRED)
	public boolean setLayersIndex(List<HashMap<String, Object>> list) throws Exception {

		int state = mapper.setLayersIndex(list);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

	public GMT_LayerVo addAndgetItem(GMT_LayerVo vo) throws Exception {

		return (GMT_LayerVo) mapper.addAndgetItem(vo);
	}

	public boolean delExcelLayer(GMT_LayerVo vo) {
		int state = mapper.delExcelLayer(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public ArrayList<GMT_LayerVo> getLayerListByAuth(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_LayerVo>) mapper.getLayerListByAuth(map);
	}
}
