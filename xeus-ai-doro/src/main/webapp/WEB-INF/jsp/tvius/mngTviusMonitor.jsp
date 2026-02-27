<%@page import="java.io.File"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Collections"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<%!/////////
    //프로그램별 상태정보를 가지는 map
    Map<String,State> statMap = Collections.synchronizedMap(new HashMap<String, State>());

    //null이면 공백문자열로 치환
    public String chk(String str) {
        if (str == null) {
            return "";
        }
        return str;
    }

    //숫자로 변환한다. null or Exception시 0으로 처리
    public int toInt(String v){
        int rv = 0;
        try{
           if("".equalsIgnoreCase(v)){
               rv = 0;
           }else{
               rv = Integer.parseInt(v);
           }
        }catch(Exception e){
            rv = 0;
        }
        return rv;
    }

    ////////////////////

    class State{
        public long timeMillis = 0L;
        public String id ="tvius";
        public int cpu = 0;  //서버의 cpu사용율 %값임
        public int mem = 0;  //서버의 meme사용율 %값임

        public int storage = 0;  //서버의 hdd사용율 %값임
        public int crunthdd = 0;  //서버의 현재 hdd 용량
        public int totalhdd = 0;  //서버의 전체 hdd사용량

        public State(String id, String cpu, String mem, String storage,String crunthdd, String totalhdd){
            this.timeMillis = System.currentTimeMillis();
            this.id = id;
            this.cpu = toInt(cpu);
            this.mem = toInt(mem);
            this.storage = toInt(storage);
            this.crunthdd = toInt(crunthdd);
            this.totalhdd = toInt(totalhdd);
        }

        //마지막 데이터 수신후 5초가 지난 경우(5초동안 상태데이터를 받지 못한 경우 서버가 죽은걸로 판단한다>)
        public boolean isDead(){
          return (System.currentTimeMillis() - timeMillis) >= 17000;
        }

        public void toXML(StringBuilder sb){
            sb.append("<id name=\'").append(id).append("\' >");
            sb.append("<cpu>").append(cpu).append("</cpu>");
            sb.append("<mem>").append(mem).append("</mem>");
            sb.append("<storage>").append(storage).append("</storage>");
            sb.append("<crunthdd>").append(crunthdd).append("</crunthdd>");
            sb.append("<totalhdd>").append(totalhdd).append("</totalhdd>");
            sb.append("<dead>").append(String.valueOf(isDead())).append("</dead>");
            sb.append("</id>");
            if(isDead()){
                statMap.remove(id);
            }
        }

        public String toString(){
            StringBuilder sb = new StringBuilder();
            toXML(sb);
            return sb.toString();
        }
    }

  //  PACKAGER
  //  NET_SERVER
  //  NET_CLIENT
  //
%>

<%
    //System.out.println("1");
    String svc = chk((String) request.getAttribute("svc"));
    if ("GetState".equalsIgnoreCase(svc)) {
        //클라이언트한테 상태정보를 전달한다.
        //DRM서버의 cpu와 mem을 계산하여 클라이언트 전달에 포함해야 한다.
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" );
		sb.append("<tvius>" );
        for(State s : statMap.values()){
            s.toXML(sb);
        }
		sb.append( "</tvius>" );

        out.print(sb.toString());
    } else {
        //id PACKAGER, NET_SERVER, NET_CLIENT
        String id = chk((String) request.getAttribute("id"));
        String cpu = chk((String) request.getAttribute("cpu"));
        String mem = chk((String) request.getAttribute("mem"));

        String storage = chk(request.getParameter("storage"));
        String crunthdd = chk(request.getParameter("crunthdd"));
        String totalhdd = chk(request.getParameter("totalhdd"));
        if("PACKAGER".equalsIgnoreCase(id) && "".equals(storage)){
            String driveName = "";
            double totalSize = 0;
            double freeSize = 0;
            double useSize = 0;
            double usePercentage = 0;
            File drive = new File("D:/GEOMEX");

            driveName = drive.getAbsolutePath();

            totalSize = (drive.getTotalSpace() / Math.pow(1024, 3));
            freeSize = (drive.getUsableSpace() / Math.pow(1024, 3));
            useSize = totalSize - freeSize;
            usePercentage = useSize / totalSize * 100;

            storage = Integer.toString((int)usePercentage);
            crunthdd = Integer.toString((int)freeSize);
            totalhdd = Integer.toString((int)totalSize);
        }
        statMap.put(id, new State(id,cpu,mem,storage,crunthdd,totalhdd));
//         statMap.put(id, new State(id,cpu,mem));
    }
%>
