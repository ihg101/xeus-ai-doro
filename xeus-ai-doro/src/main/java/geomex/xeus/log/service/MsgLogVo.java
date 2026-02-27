package geomex.xeus.log.service;


import javax.validation.constraints.Size;

import org.springmodules.validation.bean.conf.loader.annotation.handler.NotEmpty;
import org.springmodules.validation.bean.conf.loader.annotation.handler.NotNull;

/**
 * <pre>
 * 파일명 :  MsgLogVo.java
 * 설  명 :
 *   SMS 전송 로그 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 * 2018-09-12      이은규          테이블 수정으로 인한 작업
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */

public class MsgLogVo {

    private String mgrSeq;

    @NotNull(message="전송자ID는 필수사항입니다.")
    @NotEmpty(message="전송자ID는 필수사항입니다.")
    @Size(min=0, max=30, message="전송자ID는 최대 30자 까지 입력하실 수 있습니다.")
    private String senderId;

    @NotNull(message="수신자ID는 필수사항입니다.")
    @NotEmpty(message="수신자ID는 필수사항입니다.")
    @Size(min=0, max=30, message="수신자ID는 최대 30자 까지 입력하실 수 있습니다.")
    private String recvId;

    @NotNull(message="수신자핸드폰은 필수사항입니다.")
    @NotEmpty(message="수신자핸드폰은 필수사항입니다.")
    @Size(min=0, max=30, message="수신자핸드폰은 최대 30자 까지 입력하실 수 있습니다.")
    private String recvNum;

    @NotNull(message="전송구분은 필수사항입니다.")
    @NotEmpty(message="전송구분은 필수사항입니다.")
    @Size(min=0, max=2, message="전송구분은 최대 2자 까지 입력하실 수 있습니다.")
    private String sendTyp;

    @NotNull(message="전송메세지는 필수사항입니다.")
    @NotEmpty(message="전송메세지는 필수사항입니다.")
    @Size(min=0, max=1000, message="전송메세지는 최대 1000자 까지 입력하실 수 있습니다.")
    private String sendMsg;

    @Size(min=0, max=14, message="전송일자는 최대 14자 까지 입력하실 수 있습니다.")
    private String sendDt;

    @NotNull(message="전송결과는 필수사항입니다.")
    @NotEmpty(message="전송결과는 필수사항입니다.")
    @Size(min=0, max=2, message="전송결과는 최대 2자 까지 입력하실 수 있습니다.")
    private String sendRslt;

    @Size(min=0, max=1000, message="전송결과메세지는 최대 1000자 까지 입력하실 수 있습니다.")
    private String rsltDesc;

    public String getMgrSeq() {
        return mgrSeq;
    }

    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getRecvId() {
        return recvId;
    }

    public void setRecvId(String recvId) {
        this.recvId = recvId;
    }

    public String getRecvNum() {
        return recvNum;
    }

    public void setRecvNum(String recvNum) {
        this.recvNum = recvNum;
    }

    public String getSendTyp() {
        return sendTyp;
    }

    public void setSendTyp(String sendTyp) {
        this.sendTyp = sendTyp;
    }

    public String getSendMsg() {
        return sendMsg;
    }

    public void setSendMsg(String sendMsg) {
        this.sendMsg = sendMsg;
    }

    public String getSendDt() {
        return sendDt;
    }

    public void setSendDt(String sendDt) {
        this.sendDt = sendDt;
    }

    public String getSendRslt() {
        return sendRslt;
    }

    public void setSendRslt(String sendRslt) {
        this.sendRslt = sendRslt;
    }

    public String getRsltDesc() {
        return rsltDesc;
    }

    public void setRsltDesc(String rsltDesc) {
        this.rsltDesc = rsltDesc;
    }

}
