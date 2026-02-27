package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("bigDataAnalyzeService")
public class BigDataAnalyzeService extends EgovAbstractServiceImpl {

	@Resource(name = "bigDataAnalyzeMapper")
    private BigDataAnalyzeMapper mapper;

	@Resource(name = "bigDataLayerSetMapper")
	private BigDataLayerSetMapper layer;

	@Resource(name = "bigDataAnalyWeightMapper")
	private BigDataAnalyWeightMapper weight;

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDataAnalyzeVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<BigDataAnalyzeVo>) mapper.getList(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public BigDataAnalyzeVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 빅데이터를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);
		map.put("analyMgrSeq", map.get("mgrSeq"));
		map.remove("mgrSeq");

		layer.del(map);
		weight.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean delByVo(BigDataAnalyzeVo vo) throws Exception {

		int state = mapper.delByVo(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(BigDataAnalyzeVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}


	/**
	 * 빅데이터 옵션을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean add(List<BigDataLayerSetVo> layerSet, List<BigDataAnalyWeightVo> weightList) throws Exception {

		boolean result = false;
		boolean result1 = false;
		boolean result2 = false;

		int add1 = 0;
		for(int i=0; i<layerSet.size(); i++){
			add1 += layer.add(layerSet.get(i));
		}

		if(add1 > 0) result1 = true;

		int add2 = 0;
		for(int i=0; i<weightList.size(); i++){
			add2 += weight.add(weightList.get(i));
		}

		if(add2 > 0) result2 = true;

		if(result1 && result2) result = true;

		return result;
	}

	/**
	 * 빅데이터를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(BigDataAnalyzeVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(HashMap<String, String> map) throws Exception {

		BigDataAnalyzeVo vo = new BigDataAnalyzeVo();
		vo.setMgrSeq(map.get("mgrSeq"));
		vo.setAnalyNm(map.get("analyNm"));

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

	public ArrayList<HashMap<String, String>> getWfs(HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = (ArrayList<HashMap<String, String>>) mapper.getWfs(map);

		return list;
	}

}
