package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsHeatVo.java
 * 설  명 :
 *   CrmsHeat 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 09. 27.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 09. 27.
 * @version : 1.0
 * @see
 */

public class CrmsHeatVo {

    private String crimeTyp;
    private String cnt;

    public String getCrimeTyp() {
        return crimeTyp;
    }
    public void setCrimeTyp(String crimeTyp) {
        this.crimeTyp = crimeTyp;
    }
    public String getCnt() {
        return cnt;
    }
    public void setCnt(String cnt) {
        this.cnt = cnt;
    }
}
