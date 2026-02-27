package geomex.xeus.eocs.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import geomex.xeus.util.code.ServiceUtil;

@Service("eocsService")
public class EocsService {

    @Resource(name = "eocsMapper")
    private EocsMapper mapper;
    
    public ArrayList<EocsVO> getList(HashMap<String, String> map) throws Exception{
        
        ArrayList<EocsVO> list = (ArrayList<EocsVO>) mapper.getList(map);
        
        return list;
    }
    
    public EocsVO getItem(EocsVO vo) throws Exception{
    	
    	return mapper.getItem(vo);
    }

    public int delete() throws Exception{
        
        return mapper.delete();
    }
    
   public int update(HashMap<String, String> map) throws Exception{
        
        return mapper.update(map);
    }
    
    public EocsVO containsGis(String outbPosx, String outbPosy) throws Exception{
    	
    	HashMap<String, String> map = new HashMap<String, String>();
    	
    	map.put("x", outbPosx);
    	map.put("y", outbPosy);
    	map.put("dist", "10");
    	EocsVO vo = mapper.containsGis(map);
    	if ( vo != null ) vo.setDist("10");
    	return vo;
    }
    
    
    public int insert(EocsVO vo) throws Exception{
        
        return mapper.insert(vo);
    }
    
    public int getCount(HashMap<String, String> map) throws Exception {
        map = ServiceUtil.addUserInfo(map);
        int count = mapper.getCount(map);

        return count;

    }
    
}
