package geomex.xeus.sysmgr.service;

import java.util.ArrayList;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  SymIconVo.java
 * 설  명 :
 *   심볼 아이콘 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 06. 29.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2017. 06. 29.
 * @version : 1.0
 * @see
 */
public class SymIconVo {

    @NotNull(message="심볼그룹은 필수사항 입니다.")
    @NotEmpty(message="심볼그룹은 필수사항 입니다.")
    @Size(min=0, max=3, message="심볼그룹은 최대 3자 까지 입력하실 수 있습니다.")
    private String symGrp;

    @NotNull(message="구분코드는 필수사항 입니다.")
    @NotEmpty(message="구분코드는 필수사항 입니다.")
    @Size(min=0, max=5, message="구분코드는 최대 5자 까지 입력하실 수 있습니다.")
    private String gbnCd;

    @NotNull(message="아이콘타입은 필수사항 입니다.")
    @NotEmpty(message="아이콘타입은 필수사항 입니다.")
    @Size(min=0, max=1, message="아이콘타입은 최대 1자 까지 입력하실 수 있습니다.")
    private String iconTyp;

    @NotNull(message="파일명은 필수사항 입니다.")
    @NotEmpty(message="파일명은 필수사항 입니다.")
    @Size(min=0, max=255, message="파일명은 최대 255자 까지 입력하실 수 있습니다.")
    private String fileNm;

    private ArrayList<String> fileList;

    public String getSymGrp() {
        return symGrp;
    }
    public void setSymGrp(String symGrp) {
        this.symGrp = symGrp;
    }
    public String getGbnCd() {
        return gbnCd;
    }
    public void setGbnCd(String gbnCd) {
        this.gbnCd = gbnCd;
    }
    public String getIconTyp() {
        return iconTyp;
    }
    public void setIconTyp(String iconTyp) {
        this.iconTyp = iconTyp;
    }
    public String getFileNm() {
        return fileNm;
    }
    public void setFileNm(String fileNm) {
        this.fileNm = fileNm;
    }
    public ArrayList<String> getFileList() {
        return fileList;
    }
    public void setFileList(ArrayList<String> fileList) {
        this.fileList = fileList;
    }
    public String toString(){
        return "[symGrp : " + symGrp + " | gbnCd : " + gbnCd + " | iconTyp : " + iconTyp + " | fileNm : " + fileNm + "]";
    }

}
