package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

/**
 * <pre>
 * 파일명 :  SysPropService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 26.      이은규          최초 생성
 * 2019. 08. 06.	  이은규		  tvius >> sysmgr 패키지로 이동.
 *
 * </pre>
 *
 * @since  : 2017. 10. 26.
 * @version : 1.0
 * @see
 */
@Service("smsAuthService")
public class SmsAuthService {

	@Resource(name="smsAuthMapper")
    private SmsAuthMapper mapper;


	public ArrayList<SmsAuthVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<SmsAuthVo> list = (ArrayList<SmsAuthVo>) mapper.getList(map);

		return list;
	}


	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(SmsAuthVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}



	public boolean edit(HashMap<String, String> map) throws Exception {

		int state = mapper.edit(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

}
