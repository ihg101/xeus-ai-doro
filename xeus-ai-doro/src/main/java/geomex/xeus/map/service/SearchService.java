package geomex.xeus.map.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  searchServiceImpl.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 5. 29.      전우람          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 5. 29.
 * @version : 1.0
 * @see
 */
@Service("searchService")
public class SearchService extends EgovAbstractServiceImpl{
    @Resource(name="searchMapper")
    private SearchMapper dao;

    public ArrayList<EmdVo> getEmdList() throws Exception {

        ArrayList<EmdVo> list = (ArrayList<EmdVo>) dao.getEmdList();

        return list;
    }

    public ArrayList<LiVo> getLiList() throws Exception {

        ArrayList<LiVo> list = (ArrayList<LiVo>) dao.getLiList();

        return list;
    }

    public ArrayList<DoroVo> getRnList() throws Exception {

        ArrayList<DoroVo> list = (ArrayList<DoroVo>) dao.getRnList();

        return list;
    }

    public ArrayList<JibunSearchVo> getAddrSearchJibun(HashMap<String, String> map) throws Exception {

    	ArrayList<JibunSearchVo> list = (ArrayList<JibunSearchVo>) dao.getAddrSearchJibun(map);

    	return list;
    }

    public ArrayList<JibunSearchVo> getAddrSearchList(HashMap<String, String> map) throws Exception {

        ArrayList<JibunSearchVo> list = (ArrayList<JibunSearchVo>) dao.getAddrSearchList(map);

        return list;
    }
    public ArrayList<DoroSearchVo> getNewAddrSearchList(HashMap<String, String> map) throws Exception {

        ArrayList<DoroSearchVo> list = (ArrayList<DoroSearchVo>) dao.getNewAddrSearchList(map);

        return list;
    }

    public ArrayList<LocationVo> getLocation(HashMap<String, String> map) throws Exception {

        ArrayList<LocationVo> list = (ArrayList<LocationVo>) dao.getLocation(map);

        return list;
    }

    public String getCenterName(HashMap<String, String> map) throws Exception {

        String nm = (String) dao.getCenterName(map);

        return nm;
    }

    public ArrayList<BuldVo> getBuldSearchList(HashMap<String, String> map) throws Exception {

    	ArrayList<BuldVo> list = (ArrayList<BuldVo>) dao.getBuldSearchList(map);

    	return list;
    }

}
