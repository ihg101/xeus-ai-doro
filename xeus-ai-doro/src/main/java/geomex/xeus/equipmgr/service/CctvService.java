package geomex.xeus.equipmgr.service;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  IpService.java
 * 설  명 :
 *   상태 관리 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 * 2018-03-23      이은규          투망모니터링용 추가
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Service("CctvService")
public class CctvService extends EgovAbstractServiceImpl {

	@Resource(name = "CctvMapper")
    private CctvMapper mapper;

	/**
	 * CCTV 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CctvVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<CctvVo>) mapper.getList(map);
	}

	/**
	 * CCTV 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CctvVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
     * srid, lat, lon으로 geometry를 생성하여 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public CctvVo makeGeometry(HashMap<String, String> map) throws Exception {

        return mapper.makeGeometry(map);
    }

	/**
     * 투망모니터링 아이템을 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public CctvVo getNetItem(HashMap<String, String> map) throws Exception {

        return mapper.getNetItem(map);
    }

    /**
     * 투망모니터링 대상 CCTV의 영역을 구합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public CctvVo getBoundingExtent(HashMap<String, List<String>> map) throws Exception {

        return mapper.getBoundingExtent(map);
    }

    /**
     * CCTV 목적별 갯수를 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public List<CctvVo> getCntOfGbnCd(HashMap<String, String> map) throws Exception {

        return mapper.getCntOfGbnCd(map);
    }

	/**
	 * CCTV RTST IP를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CctvVo getRTSP(HashMap<String, String> map) throws Exception {

		return mapper.getRTSP(map);
	}

	/**
	 * CCTV를 삭제합니다.
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
	 * CCTV를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(CctvVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * CCTV를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(CctvVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * CCTV 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

	/**
     * CCTV 수를 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public boolean init() throws Exception {

        int state = mapper.init();

        if(state >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
	 * 입력받은 VMS의 CCTV 한 건을 조회합니다.
	 * VMS에 등록된 CCTV 목록을 얻는데 사용됩니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CctvVo getVmsItem(HashMap<String, String> map) throws Exception {

		return mapper.getVmsItem(map);
	}

	/**
	 * CCTV를 동기화합니다.
	 * 트랜잭션이 이용됩니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean syncCctv(ArrayList<HashMap<String, String>> list) throws Exception {

		boolean result = false;

		int cnt = 0;
		for(int i=0; i<list.size(); i++){

			cnt += mapper.syncCctv(list.get(i));
		}

		if(cnt > 0) result = true;

		return result;

	}

	/**
	 * CCTV 구분 정보를 가져온다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CctvVo> getGbnNm(HashMap<String, String> map) throws Exception  {

		return (ArrayList<CctvVo>) mapper.getGbnNm(map);

	}

	/**
     * CCTV를 추가합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addAll(ArrayList<CctvVo> list) throws Exception {

        CctvVo vo = null;
        StringBuilder sb = new StringBuilder();
        int index = 0;

        try {

            for(int i=0; i<list.size(); i++){
                vo = list.get(i);
                index = i+2;
                mapper.addAll(list.get(i));
            }
        } catch(Exception e) {
            sb.append("다음 "+index+"행에서 잘못된 값으로 인해 파일업로드가 실패하였습니다. <br>");
            sb.append("정확한 값을 기입했는지 확인해주세요. <br><br>");
            //sb.append("CCTV 관리번호 : " + vo.getMgrNo() + "<br><br>" );
            sb.append("CCTV 명 : " + vo.getCctvNm() + "<br><br>" );
            sb.append("접속디바이스번호 : " + vo.getDeviceId() + "<br><br>" );
            sb.append("채널번호 : " + vo.getChnlNo() + "<br><br>" );
            sb.append("설치목적 : " + vo.getGbnNm() + "<br><br>" );
            sb.append("IP주소 : " + vo.getIpAddr() + "<br><br>" );
            sb.append("Port번호 : " + vo.getPortNum() + "<br><br>" );
            sb.append("회전여부 : " + vo.getPanYn() + "<br><br>" );
            sb.append("경도 : " + vo.getLng() + "<br><br>" );
            sb.append("위도 : " + vo.getLat());
            sb.append("촬영각도 : " + vo.getAngle());
            e.printStackTrace();
            throw new Exception(sb.toString());
        }
    }

    /**
     * CCTV를 삭제합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public boolean delAll(HashMap<String, String> map) throws Exception {

        int state = mapper.delAll(map);

        if(state == 1){
            return true;
        }else{
            return false;
        }

    }
    
   public ArrayList<CctvVo> getSpecificList(HashMap<String, String>map) throws Exception{
        
        ArrayList<CctvVo> list = (ArrayList<CctvVo>) mapper.getSpecificList(map);
        
        return list;
    }
}
