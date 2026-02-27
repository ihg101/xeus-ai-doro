package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsImageVo.java
 * 설  명 :
 *   CrmsImage 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 08.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 10. 08.
 * @version : 1.0
 * @see
 */

public class CrmsImageVo {

    private String mgrSeq;
    private String regId;
    private String regUsrNm;
    private String regDat;
    @NotNull(message="이미지설명은 필수사항 입니다.")
    @NotEmpty(message="이미지설명은 필수사항 입니다.")
    @Size(min=0, max=255, message="이미지설명은 최대 255자 까지 입력하실 수 있습니다.")
    private String imgDesc;
    private String imgNm;
    private String imgPath;

    public String getMgrSeq() {
        return mgrSeq;
    }
    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }
    public String getRegId() {
        return regId;
    }
    public void setRegId(String regId) {
        this.regId = regId;
    }
    public String getRegUsrNm() {
        return regUsrNm;
    }
    public void setRegUsrNm(String regUsrNm) {
        this.regUsrNm = regUsrNm;
    }
    public String getRegDat() {
        return regDat;
    }
    public void setRegDat(String regDat) {
        this.regDat = regDat;
    }
    public String getImgDesc() {
        return imgDesc;
    }
    public void setImgDesc(String imgDesc) {
        this.imgDesc = imgDesc;
    }
    public String getImgNm() {
        return imgNm;
    }
    public void setImgNm(String imgNm) {
        this.imgNm = imgNm;
    }
    public String getImgPath() {
        return imgPath;
    }
    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }

}
