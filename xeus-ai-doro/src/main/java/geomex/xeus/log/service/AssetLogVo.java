package geomex.xeus.log.service;


import javax.validation.constraints.Size;

import org.springmodules.validation.bean.conf.loader.annotation.handler.NotEmpty;
import org.springmodules.validation.bean.conf.loader.annotation.handler.NotNull;

/**
 * <pre>
 * 파일명 :  AssetLogVo.java
 * 설  명 :
 *   시설물 관리 로그 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */

public class AssetLogVo {

    private String mgrSeq;

    @NotNull(message="작업자ID는 필수사항입니다.")
    @NotEmpty(message="작업자ID는 필수사항입니다.")
    @Size(min=0, max=30, message="작업자ID는 최대 30자 까지 입력하실 수 있습니다.")
    private String workerId;

    @NotNull(message="시설물관리번호는 필수사항입니다.")
    @NotEmpty(message="시설물관리번호는 필수사항입니다.")
    @Size(min=0, max=10, message="시설물관리번호는 최대 10자 까지 입력하실 수 있습니다.")
    private String assetMgrNo;

    @NotNull(message="작업일시는 필수사항입니다.")
    @NotEmpty(message="작업일시는 필수사항입니다.")
    @Size(min=0, max=14, message="작업일시는 최대 14자 까지 입력하실 수 있습니다.")
    private String workDat;

    @NotNull(message="작업구분은 필수사항입니다.")
    @NotEmpty(message="작업구분은 필수사항입니다.")
    @Size(min=0, max=10, message="작업구분은 최대 10자 까지 입력하실 수 있습니다.")
    private String workGbn;

    public String getMgrSeq() {
        return mgrSeq;
    }

    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }

    public String getWorkerId() {
        return workerId;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }

    public String getAssetMgrNo() {
        return assetMgrNo;
    }

    public void setAssetMgrNo(String assetMgrNo) {
        this.assetMgrNo = assetMgrNo;
    }

    public String getWorkDat() {
        return workDat;
    }

    public void setWorkDat(String workDat) {
        this.workDat = workDat;
    }

    public String getWorkGbn() {
        return workGbn;
    }

    public void setWorkGbn(String workGbn) {
        this.workGbn = workGbn;
    }

}
