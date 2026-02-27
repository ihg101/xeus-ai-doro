package geomex.xeus.equipmgr.service;

import java.io.Serializable;
import com.vividsolutions.jts.geom.Envelope;

/**
 * <pre>
 * 파일명 :  CctvSymVO.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-08      김경호          최초 생성
 * 2017-11-13      김경호          명세 수정
 *
 * </pre>
 *
 * @since : 2016. 12. 8.
 * @version : 1.0
 * @see
 */

public class CctvSymVO implements Serializable {
    private static final long serialVersionUID = -6983325309635900576L;

    private long gid;
    private double x;
    private double y;

    private String mgr_no;

    //private String labelTxt;
    private String mgrNo;
    private String cctvNm;
    private String deviceId;
    private String channelNo;

    private String gbnCd;
    private String gbnTxt;

    private String turn;
    private String tilt;
    private String zoom;
    private String talk;
    private String net;
    private double angle; //view_dir
    private String vmsMgrNo;
    private String stateCd;

    //추가정의 : 겹침처리를 위한 심볼영역
    private Envelope extent;

    public CctvSymVO() {

    }

    public void setExtent(Envelope e) {
        this.extent = e;
    }

    public Envelope getExtent() {
        return this.extent;
    }

    @Override
    public String toString() {
        return deviceId + ":" + cctvNm;
    }

    /**
     * @return the gid
     */
    public long getGid() {
        return gid;
    }

    /**
     * @param gid the gid to set
     */
    public void setGid(long gid) {
        this.gid = gid;
    }

    /**
     * @return the x
     */
    public double getX() {
        return x;
    }

    /**
     * @param x the x to set
     */
    public void setX(double x) {
        this.x = x;
    }

    /**
     * @return the y
     */
    public double getY() {
        return y;
    }

    /**
     * @param y the y to set
     */
    public void setY(double y) {
        this.y = y;
    }

    /**
     * @return the mgr_no
     */
    public String getMgr_no() {
        return mgr_no;
    }

    /**
     * @param mgr_no the mgr_no to set
     */
    public void setMgr_no(String mgr_no) {
        this.mgr_no = mgr_no;
    }

    /**
     * @return the mgrNo
     */
    public String getMgrNo() {
        return mgrNo;
    }

    /**
     * @param mgrNo the mgrNo to set
     */
    public void setMgrNo(String mgrNo) {
        this.mgrNo = mgrNo;
    }

    /**
     * @return the cctvNm
     */
    public String getCctvNm() {
        return cctvNm;
    }

    /**
     * @param cctvNm the cctvNm to set
     */
    public void setCctvNm(String cctvNm) {
        this.cctvNm = cctvNm;
    }

    /**
     * @return the deviceId
     */
    public String getDeviceId() {
        return deviceId;
    }

    /**
     * @param deviceId the deviceId to set
     */
    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    /**
     * @return the channelNo
     */
    public String getChannelNo() {
        return channelNo;
    }

    /**
     * @param channelNo the channelNo to set
     */
    public void setChannelNo(String channelNo) {
        this.channelNo = channelNo;
    }

    /**
     * @return the gbnCd
     */
    public String getGbnCd() {
        return gbnCd;
    }

    /**
     * @param gbnCd the gbnCd to set
     */
    public void setGbnCd(String gbnCd) {
        this.gbnCd = gbnCd;
    }

    /**
     * @return the gbnTxt
     */
    public String getGbnTxt() {
        return gbnTxt;
    }

    /**
     * @param gbnTxt the gbnTxt to set
     */
    public void setGbnTxt(String gbnTxt) {
        this.gbnTxt = gbnTxt;
    }

    /**
     * @return the turn
     */
    public String getTurn() {
        return turn;
    }

    /**
     * @param turn the turn to set
     */
    public void setTurn(String turn) {
        this.turn = turn;
    }

    /**
     * @return the tilt
     */
    public String getTilt() {
        return tilt;
    }

    /**
     * @param tilt the tilt to set
     */
    public void setTilt(String tilt) {
        this.tilt = tilt;
    }

    /**
     * @return the zoom
     */
    public String getZoom() {
        return zoom;
    }

    /**
     * @param zoom the zoom to set
     */
    public void setZoom(String zoom) {
        this.zoom = zoom;
    }

    /**
     * @return the talk
     */
    public String getTalk() {
        return talk;
    }

    /**
     * @param talk the talk to set
     */
    public void setTalk(String talk) {
        this.talk = talk;
    }

    /**
     * @return the net
     */
    public String getNet() {
        return net;
    }

    /**
     * @param net the net to set
     */
    public void setNet(String net) {
        this.net = net;
    }

    /**
     * @return the angle
     */
    public double getAngle() {
        return angle;
    }

    /**
     * @param angle the angle to set
     */
    public void setAngle(double angle) {
        this.angle = angle;
    }

	/**
	 * @return the vmsMgrNo
	 */
	public String getVmsMgrNo() {
		return vmsMgrNo;
	}

	/**
	 * @param vmsMgrNo the vmsMgrNo to set
	 */
	public void setVmsMgrNo(String vmsMgrNo) {
		this.vmsMgrNo = vmsMgrNo;
	}

	public String getStateCd() {
		return stateCd;
	}

	public void setStateCd(String stateCd) {
		this.stateCd = stateCd;
	}

}
