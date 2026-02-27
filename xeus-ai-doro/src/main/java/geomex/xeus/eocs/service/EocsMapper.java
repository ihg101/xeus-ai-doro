package geomex.xeus.eocs.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("eocsMapper")
public interface EocsMapper {
    
    public int insert(EocsVO vo) throws Exception;
    public int delete() throws Exception;
    public int update(HashMap<String, String> map) throws Exception;
    public List<EocsVO> getList(Map<String, String> map) throws Exception;
    public int getCount(HashMap<String, String> map) throws Exception;
    public EocsVO containsGis(HashMap<String, String> map) throws Exception;
    
    public EocsVO getItem(EocsVO vo) throws Exception;
}
