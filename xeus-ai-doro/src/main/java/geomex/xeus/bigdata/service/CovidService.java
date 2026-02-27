package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("covidService")
public class CovidService extends EgovAbstractServiceImpl {

	@Resource(name = "covidMapper")
	private CovidMapper mapper;

	/**
	 * COVID-19 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CovidVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<CovidVo>) mapper.getList(map);
	}

	/**
	 * COVID-19 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CovidVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * COVID-19를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * COVID-19를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(CovidVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * COVID-19를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean addExcel(ArrayList<CovidVo> list) throws Exception {

		boolean first = false;

		boolean result = false;
		int state = 0;
		for(int i=0; i<list.size(); i++){
			try{

				state += mapper.add(list.get(i));
			}catch(Exception e){
				if(!first){
					e.printStackTrace();
					first = true;
				}
			}
		}

		if(state > 0) result = true;

		return result;
	}

	/**
	 * COVID-19를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(CovidVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * COVID-19 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

}
