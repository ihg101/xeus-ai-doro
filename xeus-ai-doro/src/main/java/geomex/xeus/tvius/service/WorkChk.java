package geomex.xeus.tvius.service;

public class WorkChk {

    private boolean result;
    private String workMsg;
    private String workMsg2;

    public WorkChk(){
        this.result = false;
        this.workMsg = "";
        this.workMsg2 = "";
    }
    public boolean isResult() {
        return result;
    }
    public void setResult(boolean result) {
        this.result = result;
    }
    public String getWorkMsg() {
        return workMsg;
    }
    public void setWorkMsg(String workMsg) {
        this.workMsg = workMsg;
    }
    public String getWorkMsg2() {
        return workMsg2;
    }
    public void setWorkMsg2(String workMsg2) {
        this.workMsg2 = workMsg2;
    }

	@Override
	public String toString() {
		return "WorkChk [result=" + result + ", workMsg=" + workMsg + ", workMsg2=" + workMsg2 + "]";
	}
}
