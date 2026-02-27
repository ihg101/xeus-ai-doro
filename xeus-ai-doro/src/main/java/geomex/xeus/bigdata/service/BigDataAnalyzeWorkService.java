package geomex.xeus.bigdata.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  BigDataAnalyzeWorkService.java
 * 작성자 :  김경호
 * 작성일 :  2018. 12. 6.
 * 버전   :  1.0
 * 설명   :
 * 클래스 설명을 쓰시오
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018.12.31      김경호          빅데이터 분석 수정 반영
 * 2021.03.18      이주영          빅데이터 분석 로직 수정 (10m, 가중치 로직 장애)
 * ===========================================================
 * </pre>
 */

@Service("bigDataAnalyzeWorkService")
public class BigDataAnalyzeWorkService {
    protected Logger logger = LoggerFactory.getLogger(BigDataAnalyzeWorkService.class);

    // 분석 관리번호 가져오기
    // 레이어셋 가져오기
    //  - 레이어_1(loop)
    //     - 레이어 가중치 가져오기
    //     - 레이어 전체 _geometry, 항목, result_val 가져오기(곱).
    //     - 레이어데이터(loop)
    //         - intersects(geometry(버퍼), gric_geometry) => grid 가져오기
    //     - result set에 10m_gid 넣고, result_val 더하기(있으면 더하고 없으면 추가)
    //       (Thread 처리)....
    //       //10m 주소 갱신, 100M grid_text기 넣기.
    //  - 레이어_2(loop)
    // public

    @Resource(name = "dataSource")
    private DataSource dataSource;

    @Resource(name = "bigDataLayerSetService")
    private BigDataLayerSetService layerSetService;

    @Resource(name = "bigDataAnalyWeightService")
    private BigDataAnalyWeightService weightService;

    @Resource(name = "bigDataAnalyzeService")
    private BigDataAnalyzeService analyService;

    @Resource(name = "bigDataAnalyHistService")
    private BigDataAnalyHistService histService;

    private Connection getConnection() {
        Connection con = null;
        try {
            con = DataSourceUtils.getConnection(dataSource);
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        }
        return con;
    }

    //1) 즉시실행 : I:00:00
    //2) 매주실행 : W:01:00 --> 일~~토(1,2,3,4,5,6,7)
    //3) 매월실행 : M:01:00 --> 매월 1일 실행
    //4) 분기실행 : Q:01:00 --> 매분기(4,7,10,1) 1일 실행
    //5) 매년실행 : Y:01:01 --> 매년 1월 1일 실행

    //C65 처리상태  11  즉시접수대기
    //C65 처리상태  12  처리중
    //C65 처리상태  13  처리완료
    //C65 처리상태  99  에러

    private void analyzeScheduled() {
        try {
            ArrayList<BigDataAnalyzeVo> waited = getScheduledAnalyList();
            if (waited.isEmpty()) return;

            GregorianCalendar cal = new GregorianCalendar();
            int month = cal.get(Calendar.MONTH) + 1;   //(0~11)
            int day = cal.get(Calendar.DAY_OF_MONTH);
            int week = cal.get(Calendar.DAY_OF_WEEK); //일~토(1~7)
            //로그 기록......
            logger.debug("analyzeScheduled : " + waited.size());
            for (BigDataAnalyzeVo analyVo : waited) {
                String plan[] = StringUtils.split(analyVo.getAnalyPlan(), ":");
                if (StringUtils.equalsIgnoreCase("W", plan[0])) {  //매주
                    int pWeek = Integer.parseInt(plan[1]);  //요일
                    if (week == pWeek) {
                        analyze(analyVo);
                    }
                } else if (StringUtils.equalsIgnoreCase("M", plan[0])) {  //매월
                    int pDay = Integer.parseInt(plan[1]);  //일
                    if (day == pDay) {
                        analyze(analyVo);
                    }
                } else if (StringUtils.equalsIgnoreCase("Q", plan[0])) {  //매분기
                    if (month == 1 && month == 4 && month == 7 && month == 10) {
                        int pDay = Integer.parseInt(plan[1]);  //일
                        if (day == pDay) {
                            analyze(analyVo);
                        }
                    }
                } else if (StringUtils.equalsIgnoreCase("Y", plan[0])) {  //매년
                    int pMonth = Integer.parseInt(plan[1]); //월
                    int pDay = Integer.parseInt(plan[2]);  //일
                    if (month == pMonth && day == pDay) {
                        analyze(analyVo);
                    }
                }
            }

        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        }
    }

    //주기적으로 처리할 목록을 가져온다. //새벽에???
    private ArrayList<BigDataAnalyzeVo> getScheduledAnalyList() {
        ArrayList<BigDataAnalyzeVo> all = new ArrayList<BigDataAnalyzeVo>();
        try {
            HashMap<String, String> param = new HashMap<String, String>();
            param.put("analyPlan", "W"); //매주실행...
            all.addAll(analyService.getList(param));
            //
            param.put("analyPlan", "M"); //매월실행...
            all.addAll(analyService.getList(param));
            //
            param.put("analyPlan", "Q"); //분기실행...
            all.addAll(analyService.getList(param));
            //
            param.put("analyPlan", "Y"); //매년실행...
            all.addAll(analyService.getList(param));
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        }
        return all;
    }

    //대기중인 즉시실행 분석을 실행한다.
    private void analyzeImmediately() {
        try {
            HashMap<String, String> param = new HashMap<String, String>();
            param.put("analyPlan", "I"); //즉시실행...
            param.put("analyState", "11"); //접수대기 목록을 가져온다.
            param.put("sortCol", "rqst_dat");
            param.put("sortTyp", "asc");
            //param.put("limit", "1");
            //param.put("offset", "0");
            ArrayList<BigDataAnalyzeVo> waited = analyService.getList(param);
            for (BigDataAnalyzeVo analyVo : waited) {
                analyze(analyVo);
            }
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        }
    }

    ///////////////////////////////////////
    private void analyze(BigDataAnalyzeVo analyVO) {
        try {
            String tblParam = analyVO.getMgrSeq() + "_" + DateFormatUtils.format(new GregorianCalendar(), "yyMMddHHmmss");
            logger.info("빅데이터 분석 시작: " + tblParam + " >> " + analyVO.toString());
            //마지막 분석시작일 xeus.bigdata_analyze 테이블 갱신
            BigDataAnalyzeVo resultVO = new BigDataAnalyzeVo();
            resultVO.setMgrSeq(analyVO.getMgrSeq());
            resultVO.setAnalyState("12");
            resultVO.setAnalyDat(DateFormatUtils.format(new GregorianCalendar(), "yyyyMMddHHmmss"));
            analyService.edit(resultVO);

            analyzeOne(analyVO.getMgrSeq(), tblParam);  //분석관리번호

            //마지막 분석완료 시간 및 상태 xeus.bigdata_analyze 갱신
            resultVO = new BigDataAnalyzeVo();
            resultVO.setMgrSeq(analyVO.getMgrSeq());
            resultVO.setAnalyState("13");
            resultVO.setFinishDat(DateFormatUtils.format(new GregorianCalendar(), "yyyyMMddHHmmss"));
            analyService.edit(resultVO);
        } catch (Exception e) {
        	e.printStackTrace();
            BigDataAnalyzeVo resultVO = new BigDataAnalyzeVo();
            resultVO.setMgrSeq(analyVO.getMgrSeq());
            resultVO.setAnalyState("99");
            try {
                analyService.edit(resultVO); //xeus.bigdata_analyze 갱신
            } catch (Exception ae) {
                logger.error(ExceptionUtils.getStackTrace(ae));
            }
            logger.error(ExceptionUtils.getStackTrace(e));
        }
    }

    //분석을 1개 수행한다.
    private void analyzeOne(String analyMgrSeq, String tblParam) throws Exception {
        HashMap<String, String> param = new HashMap<String, String>();
        param.put("analyMgrSeq", analyMgrSeq);
        param.put("sortCol", "layer_seq");
        param.put("sortTyp", "asc");
        //
        //분석 결과를 hist에 입력해야 한다.
        BigDataAnalyHistVo histVo = new BigDataAnalyHistVo();
        histVo.setAnalyMgrSeq(analyMgrSeq);
        histVo.setAnalyDat(DateFormatUtils.format(new GregorianCalendar(), "yyyyMMddHHmmss"));
        histVo.setAnalyState("12");
        try {
            //1.분석결과 레이어 생성
            createResultTable(tblParam);
            //2. 분석레이어목록 가져오기.
            ArrayList<BigDataLayerSetVo> layers = layerSetService.getList(param);
            //
            HashMap<String, String> cmd = new HashMap<String, String>();

            //3. 레이어별로 하나씩 분석하기
            for (int x = 0; x < layers.size(); x++) {
                BigDataLayerSetVo layer = layers.get(x);
                cmd.clear();
                cmd.put("analyMgrSeq", analyMgrSeq);   //bigdata_analy_weight분석관리번호
                cmd.put("layerId", layer.getLayerId()); //레이어 아이디
                cmd.put("itemNm", layer.getItemNm()); // 아이템 이름

                //레이어 가중치 정보 가져오기
                BigDataAnalyWeightVo weight = weightService.getItem(cmd);
                //레이어별 분석...
                analyzeLayer(weight, layer.getWeightVal(), tblParam);
            }
            //정상처리결과
            histVo.setResultTblNm("xeus.bigdata_analy_result" + tblParam);
            histVo.setAnalyState("13");
            histVo.setFinishDat(DateFormatUtils.format(new GregorianCalendar(), "yyyyMMddHHmmss"));
        } catch (Exception e) {
        	e.printStackTrace();
            histVo.setAnalyState("99");
            String errorMsg = ExceptionUtils.getStackTrace(e);
            histVo.setErrorMsg(errorMsg);
            logger.error(errorMsg);
            deleteResultTable(tblParam);  //오류시 결과 테이블을 날린다.
            //throw e;
        } finally {
            try {
                histService.add(histVo);
            } catch (Exception e) {
                logger.error(ExceptionUtils.getStackTrace(e));
            }
        }
    }

    //가중치를 반영하여 레이어 각 레코드를 분석하여 결과 저장
    private void analyzeLayer(BigDataAnalyWeightVo weight, String lyrWeight, String tblParam) throws Exception {
        logger.info("빅데이터 레이어 분석: " + tblParam + " " + weight.toString());
        Connection selectCon = getConnection();
        PreparedStatement selectPsmt = null;
        ResultSet selectRs = null;
        //
        Connection insCon = getConnection();
        PreparedStatement insPsmt = null;
        //
        try {
            int cnt = 0;
            //분석대상 레이어 읽어오기
            String selectSQL = getSelectSQL(weight, lyrWeight);


            //결과 입력하기...
            String insSQL = getInsertSQL(tblParam);

            selectPsmt = selectCon.prepareStatement(selectSQL);

            selectRs = selectPsmt.executeQuery();

            insPsmt = insCon.prepareStatement(insSQL);
            while (selectRs.next()) {
                long analyMgrSeq = selectRs.getLong(1); //analy_mgr_seq
                long g10mGid = selectRs.getLong(2); //grid10m_gid
                long g100mGid = selectRs.getLong(3); //grid100m_gid
                String jibn = selectRs.getString(4); //jibn_addr
                long val = selectRs.getLong(5); //val
                insPsmt.setLong(1, analyMgrSeq);
                insPsmt.setLong(2, g10mGid);
                insPsmt.setLong(3, g100mGid);
                insPsmt.setString(4, jibn);
                insPsmt.setLong(5, val);

                insPsmt.addBatch();
                cnt++;
                if (cnt % 5000 == 0) {
                    insPsmt.executeBatch();
                    insPsmt.clearBatch();
                }
            }
            insPsmt.executeBatch();
            insPsmt.clearBatch();
            //logger.info("레이어 분석결과 : " + weight.getAnalyMgrSeq() + " : " + cnt);
        } catch (Exception e) {
            //throw e;
        	e.printStackTrace();
        } finally {
            close(insCon, insPsmt, null);
            close(selectCon, selectPsmt, selectRs);
        }
    }

    private String getInsertSQL(String tblParam) {
        StringBuilder sb = new StringBuilder(1000);
        sb.append("insert into xeus.bigdata_analy_result").append(tblParam);
        sb.append("(analy_mgr_seq,grid10m_gid,grid100m_gid,jibn_addr,result_val)");
        sb.append("values(?,?,?,?,?)");
        sb.append("ON CONFLICT (grid10m_gid) ");
        sb.append("DO UPDATE SET result_val = ");
        sb.append("bigdata_analy_result").append(tblParam).append(".result_val + excluded.result_val;");

        return sb.toString();
    }

    private String getSelectSQL(BigDataAnalyWeightVo w, String lyrW) {
        StringBuilder sb = new StringBuilder(2000);
        sb.append(" select ").append(w.getAnalyMgrSeq()).append(" as analy_mgr_seq,");
        sb.append(" g10m._gid as grid10m_gid,");
        sb.append(" g100m._gid as grid100m_gid,");
        sb.append(" g10m.jibn as jibn_addr,");

        // String itemName = w.getItemNm();
        //-unknown-
        if (StringUtils.isBlank(w.getItemNm()) || StringUtils.equalsIgnoreCase(w.getItemNm(), "-unknown-")) {
            //항목명이 없을때
            sb.append(" round (");
            sb.append(w.getWeightVal()).append("*").append(lyrW);
            sb.append(")::numeric as val");
        } else {
            //항목명이 있을때
            sb.append(" round (");
            sb.append("(").append("lyr.").append("\"" + w.getItemNm() + "\"").append(w.getOpeStr()).append(w.getWeightVal()).append(")").append("*")
                .append(lyrW);
            sb.append(")::numeric as val");
        }

        sb.append(" from ")/*.append("xeus.")*/.append(w.getLayerId()).append(" lyr,");
        sb.append(" xeus.bigdata_grid_10m g10m,");
        sb.append(" xeus.bigdata_grid_100m g100m ");

        //버퍼가 0일 경우
        if("0".equals(w.getImpactM())){
        	sb.append(" where st_intersects(").append("lyr._geometry, g10m._geometry)");
        }else{
        	sb.append(" where st_intersects(st_buffer(lyr._geometry,").append(w.getImpactM()).append("),g10m._geometry)");
        }

        sb.append(" and st_contains(g100m._geometry, ST_SetSRID(ST_Point(g10m._annox,g10m._annoy),5186))");

        return sb.toString();
    }
    //결과 케이블을 생성한다.
    private void createResultTable(String tblParam) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("DROP TABLE IF EXISTS xeus.bigdata_analy_result").append(tblParam);
        sb.append(" CASCADE;").append("\r\n");
        sb.append("CREATE TABLE xeus.bigdata_analy_result").append(tblParam).append("\r\n");
        sb.append("( ").append("\r\n");
        sb.append("  mgr_seq bigserial NOT NULL, -- 관리순서번호 ").append("\r\n");
        sb.append("  analy_mgr_seq numeric(32,0) NOT NULL, -- 분석관리번호 ").append("\r\n");
        sb.append("  grid10m_gid numeric(32,0) default 0, -- 셀10m식별번호 ").append("\r\n");
        sb.append("  grid100m_gid numeric(32,0) NOT NULL, -- 셀100M식별번호 ").append("\r\n");
        //  sb.append("  grid10m_gid numeric(32,0) NOT NULL, -- 셀10M식별번호 ").append("\r\n");
        //  sb.append("  grid_txt character(12), -- 셀10M지점번호 ").append("\r\n");
        sb.append("  jibn_addr character varying(200) default '', -- 지번주소 ").append("\r\n");
        sb.append("  road_addr character varying(200) default '', -- 새주소 ").append("\r\n");
        sb.append("  result_val numeric(10,0) default 0, -- 결과값 ").append("\r\n");
        sb.append("  rgb_txt character varying(10) default '', -- 색상 ").append("\r\n");
        sb.append("  grp_nm character varying(200) default '', -- 결과그룹명 ").append("\r\n");
        sb.append("  CONSTRAINT xeus_bigdata_analy_result").append(tblParam).append("_pk");
        sb.append("  PRIMARY KEY (grid10m_gid) ").append("\r\n");
        sb.append("); ");
        Connection con = this.getConnection();
        PreparedStatement ps = null;
        try {
            con.setAutoCommit(true);
            ps = con.prepareStatement(sb.toString());
            ps.execute();
            logger.error("결과 테이블 생성 : xeus.bigdata_analy_result" + tblParam);
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
            throw e;
        } finally {
            close(con, ps, null);
        }
    }

    //결과 저장테이블을 제거한다..오류 발생시
    private void deleteResultTable(String tblParam) {
        Connection con = this.getConnection();
        PreparedStatement ps = null;
        try {
            con.setAutoCommit(true);
            ps = con.prepareStatement("drop table xeus.bigdata_analy_result" + tblParam + " cascade;");
            ps.execute();
            logger.error("결과 테이블 삭제(오류) : " + tblParam);
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        } finally {
            close(con, ps, null);
        }
    }

    private void close(Connection con, PreparedStatement ps, ResultSet rs) {
        try {
            if (rs != null) rs.clearWarnings();
        } catch (Exception e) {}
        try {
            if (rs != null) rs.close();
        } catch (Exception e) {}
        try {
            if (ps != null) ps.clearParameters();
        } catch (Exception e) {}
        try {
            if (ps != null) ps.clearWarnings();
        } catch (Exception e) {}
        try {
            if (ps != null) ps.close();
        } catch (Exception e) {}
        try {
            if (con != null) con.close();
        } catch (Exception e) {}
    }

    private Timer reloadTimer = null;
    private TimerTask reloadTask = null;

    @PostConstruct
    public void initIt() throws Exception {
        reloadTask = new TimerTask() {
            private boolean analyzed = true;  //

            @Override
            public void run() {
                GregorianCalendar cal = new GregorianCalendar();
                int hour = cal.get(Calendar.HOUR_OF_DAY); //24
                int minute = cal.get(Calendar.MINUTE); //분
                if (hour == 1 && minute == 30) {
                    //매일 1시 30분이면 주기적으로 수행할 분석을 체크하여 분석한다.
                    //아직 1시 30 인데 주기적 분석이 이미 끝낫을 경우 중복실행을 방지하기 위해 추가.
                    if (analyzed) {
                        analyzeScheduled();
                        analyzed = false;
                    }
                } else {
                    analyzed = true;
                }
                //즉시 수행한다.
                analyzeImmediately();
            }
        };
        reloadTimer = new Timer();
        reloadTimer.schedule(reloadTask, 10 * 1000, 30 * 1000); //30초에 한번씩 설정을 reload한다.
    }

    @PreDestroy
    public void cleanUp() throws Exception {
        if (reloadTimer != null) {
            reloadTimer.cancel();
            reloadTimer = null;
        }
    }
}
