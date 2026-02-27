package geomex.xeus.log.service;


import javax.validation.constraints.Size;

import org.springmodules.validation.bean.conf.loader.annotation.handler.NotEmpty;
import org.springmodules.validation.bean.conf.loader.annotation.handler.NotNull;

/**
 * <pre>
 * 파일명 :  LogStatVo.java
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

public class LogStatVo {

    private String gbn;
    private String all;
    private String jan;
    private String feb;
    private String mar;
    private String apr;
    private String may;
    private String jun;
    private String jul;
    private String aug;
    private String sep;
    private String oct;
    private String nov;
    private String dec;

    public String getGbn() {
        return gbn;
    }
    public void setGbn(String gbn) {
        this.gbn = gbn;
    }
    public String getAll() {
        return all;
    }
    public void setAll(String all) {
        this.all = all;
    }
    public String getJan() {
        return jan;
    }
    public void setJan(String jan) {
        this.jan = jan;
    }
    public String getFeb() {
        return feb;
    }
    public void setFeb(String feb) {
        this.feb = feb;
    }
    public String getMar() {
        return mar;
    }
    public void setMar(String mar) {
        this.mar = mar;
    }
    public String getApr() {
        return apr;
    }
    public void setApr(String apr) {
        this.apr = apr;
    }
    public String getMay() {
        return may;
    }
    public void setMay(String may) {
        this.may = may;
    }
    public String getJun() {
        return jun;
    }
    public void setJun(String jun) {
        this.jun = jun;
    }
    public String getJul() {
        return jul;
    }
    public void setJul(String jul) {
        this.jul = jul;
    }
    public String getAug() {
        return aug;
    }
    public void setAug(String aug) {
        this.aug = aug;
    }
    public String getSep() {
        return sep;
    }
    public void setSep(String sep) {
        this.sep = sep;
    }
    public String getOct() {
        return oct;
    }
    public void setOct(String oct) {
        this.oct = oct;
    }
    public String getNov() {
        return nov;
    }
    public void setNov(String nov) {
        this.nov = nov;
    }
    public String getDec() {
        return dec;
    }
    public void setDec(String dec) {
        this.dec = dec;
    }

}
