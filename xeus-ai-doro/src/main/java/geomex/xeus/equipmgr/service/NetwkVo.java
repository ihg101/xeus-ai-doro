package geomex.xeus.equipmgr.service;

import java.util.List;

import javax.validation.constraints.Size;

/**
 * <pre>
 * 파일명 :  NetwkVo.java
 * 설  명 :
 *   네트워크망 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-09-13      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 9. 13.
 * @version :  1.0
 * @see
 */

public class NetwkVo {

    @Size(min=0, max=10, message="시작시설관리번호는 최대 10자 까지 입력하실 수 있습니다.")
    private String stMgrNo;
    @Size(min=0, max=10, message="종료시설관리번호는 최대 10자 까지 입력하실 수 있습니다.")
    private String edMgrNo;
    @Size(min=0, max=2, message="망구분코드는 최대 2자 까지 입력하실 수 있습니다.")
    private String netGbnCd;
    @Size(min=0, max=2, message="배선방식코드는 최대 2자 까지 입력하실 수 있습니다.")
    private String linkGbnCd;
    @Size(min=0, max=100, message="케이블종류는 최대 100자 까지 입력하실 수 있습니다.")
    private String cableTyp;
    @Size(min=0, max=255, message="케이블설명은 최대 255자 까지 입력하실 수 있습니다.")
    private String cableDesc;
    @Size(min=0, max=2, message="연결상태는 최대 2자 까지 입력하실 수 있습니다.")
    private String connStat;
    @Size(min=0, max=100, message="망이름은 최대 100자 까지 입력하실 수 있습니다.")
    private String netNm;

    private String gid;
    private String geometry;

    private String lineColor;
    private String ringNo;

    private String themeMgrNo;

    private String lng;
    private String lat;

    private String tmx;
    private String tmy;

    private String wkt;

    private List<NetwkVo> CableList;

    public String getStMgrNo() {
        return stMgrNo;
    }
    public void setStMgrNo(String stMgrNo) {
        this.stMgrNo = stMgrNo;
    }
    public String getEdMgrNo() {
        return edMgrNo;
    }
    public void setEdMgrNo(String edMgrNo) {
        this.edMgrNo = edMgrNo;
    }
    public String getNetGbnCd() {
        return netGbnCd;
    }
    public void setNetGbnCd(String netGbnCd) {
        this.netGbnCd = netGbnCd;
    }
    public String getLinkGbnCd() {
        return linkGbnCd;
    }
    public void setLinkGbnCd(String linkGbnCd) {
        this.linkGbnCd = linkGbnCd;
    }
    public String getCableTyp() {
        return cableTyp;
    }
    public void setCableTyp(String cableTyp) {
        this.cableTyp = cableTyp;
    }
    public String getCableDesc() {
        return cableDesc;
    }
    public void setCableDesc(String cableDesc) {
        this.cableDesc = cableDesc;
    }
    public String getConnStat() {
        return connStat;
    }
    public void setConnStat(String connStat) {
        this.connStat = connStat;
    }
    public String getNetNm() {
        return netNm;
    }
    public void setNetNm(String netNm) {
        this.netNm = netNm;
    }
    public String getGid() {
        return gid;
    }
    public void setGid(String gid) {
        this.gid = gid;
    }
    public String getGeometry() {
        return geometry;
    }
    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }
	public String getLineColor() {
		return lineColor;
	}
	public void setLineColor(String lineColor) {
		this.lineColor = lineColor;
	}
	public String getRingNo() {
		return ringNo;
	}
	public void setRingNo(String ringNo) {
		this.ringNo = ringNo;
	}
	public String getThemeMgrNo() {
		return themeMgrNo;
	}
	public void setThemeMgrNo(String themeMgrNo) {
		this.themeMgrNo = themeMgrNo;
	}
	public String getLng() {
		return lng;
	}
	public void setLng(String lng) {
		this.lng = lng;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public String getTmx() {
		return tmx;
	}
	public void setTmx(String tmx) {
		this.tmx = tmx;
	}
	public String getTmy() {
		return tmy;
	}
	public void setTmy(String tmy) {
		this.tmy = tmy;
	}
	public String getWkt() {
		return wkt;
	}
	public void setWkt(String wkt) {
		this.wkt = wkt;
	}
	public List<NetwkVo> getCableList() {
		return CableList;
	}
	public void setCableList(List<NetwkVo> cableList) {
		CableList = cableList;
	}

}
