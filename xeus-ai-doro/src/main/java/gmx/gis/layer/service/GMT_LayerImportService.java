package gmx.gis.layer.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.proxy.service.GMT_ProxyService;
import gmx.gis.util.code.GMT_EtcUtil;
import gmx.gis.util.code.GMT_StrUtil;

/**
 *
 * <pre>
 *	Excel, Shp import 시,
 * DB 와 엔진에 관련된 작업을 수행합니다.
 * </pre>
 *
 * @author 장대건, 이주영
 *
 */
@Service
public class GMT_LayerImportService extends EgovAbstractServiceImpl {

	@Autowired
	private GMT_LayerMapper layerMapper;

	@Autowired
	private GMT_LayerStyleMapper styleMapper;

	@Autowired
	private GMT_ProxyService proxyService;

	/**
	 * 신규 레이어 생성 후 gis_lyr_list, gis_lyr_style 테이블에 데이터를 추가합니다.
	 * 또한 데이터 추가 완료 후 엔진에 레이어를 등록합니다.
	 *
	 * @param map (schemNm, tblNm, lyrNm, lyrTyp, grpMgrSeq, mkUser)
	 * @throws Exception
	 */
	public void importLayer(HashMap<String, String> map) throws Exception {
		// 1. gis_lyr_list 에 추가
		GMT_LayerVo layerVo = new GMT_LayerVo();
		layerVo.setSchemNm(map.get("schemNm"));
		layerVo.setTblId(map.get("tblNm"));
		layerVo.setLyrNm(map.get("lyrNm"));
		layerVo.setLyrTyp(map.get("lyrTyp"));
		layerVo.setGrpMgrSeq(Integer.parseInt(map.get("grpMgrSeq")));
		layerVo.setMkUser(map.get("mkUser"));

		GMT_LayerVo affectVo = layerMapper.addAndgetItem(layerVo);

		// 2. gis_lyr_style 에 추가
		GMT_LayerStyleVo styleVo = new GMT_LayerStyleVo();
		styleVo.setLyrMgrSeq(affectVo.getMgrSeq());
		styleMapper.add(styleVo);

		// 3. 엔진에 레이어 등록
		try {
			JSONObject rqstResultObj = proxyService.manageLayer("add", map.get("schemNm"), map.get("tblNm"), map.get("lyrNm"));
			boolean result =  (boolean) rqstResultObj.get("result");

			if(result) {
				egovLogger.debug("Request GIS Engine Successfully .. ResultXML :: " + rqstResultObj.toJSONString());
			} else {
				String responseXML =  (String) rqstResultObj.get("responseXML");
				if(GMT_StrUtil.isEmpty(responseXML)) {
					System.err.println("No Message From GIS Engine ...");
					throw new Exception("No Message From GIS Engine ...");
				} else {
					String exceptionMsg = getExceptionMsg(responseXML);
					System.err.println("Request GIS Engine Successfully .. But GIS Engine Error :: " + exceptionMsg);
					throw new Exception("Request GIS Engine Successfully .. But GIS Engine Error :: " + exceptionMsg);
				}
			}
		} catch (Exception e) {
			System.err.println("Error Occured When Request GIS Engine Proxy ...");
			e.printStackTrace();
			throw e;
		}
	}

	public String getExceptionMsg(String responseXML) throws Exception {
		InputStream is = new ByteArrayInputStream(responseXML.getBytes());
		Element el = GMT_EtcUtil.parseDOM(is);
		Element exceptEl = GMT_EtcUtil.getElementByName(el, "Exception");

		return GMT_EtcUtil.getTagValue(exceptEl);
	}
}
