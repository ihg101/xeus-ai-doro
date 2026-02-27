package gmx.gis.nms.service;

import java.net.InetAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import geomex.xeus.util.code.DateUtil;

/**
 * <pre>
 * 주기적으로 Ping 신호를 요청하여 상태를 갱신합니다.
 *
 * <b style="color:red;">xeus.gmx_nms_ping 테이블과 개별 테이블의 state_cd 필드를 의존합니다.</b>
 * </pre>
 *
 * @author 이주영
 *
 */
@Service
public class GMT_AutoPingService {

	@Autowired GMT_PingService svc;

	private HashMap<String, GMT_PingVo> dbList = null;

	private HashMap<String, Integer> pingList = null;
	private HashMap<String, TimerTask> taskList = null;
	private HashMap<String, Timer> timerList = null;

	/**
	 * <pre>
	 * 테이블에 IP 체크 대상 리스트를 가져옵니다.
	 *
	 * <b style="color:red;">만약, gis_lyr_list 에서 대상 테이블이 제거될 경우 Ping 목록에서도 연쇄 제거 됩니다.</b>
	 * </pre>
	 *
	 * @throws Exception
	 */
	private void initializeDbPingList() throws Exception{
		//TODO 1. 테이블의 목록을 가져온다.
		//TODO 2. 목록 취득시 실제 테이블이 존재하는지 확인한다.
		//TODO 3. 제거된 테이블일 경우 타이머를 제거한다.
		//TODO 4. 존재하는 테이블일 state_cd 필드가 존재하는지 확인한다.
		ArrayList<GMT_PingVo> dbList = svc.getList(null);
		if(dbList != null){
			for(GMT_PingVo vo : dbList){
				String schemAndTable = vo.getSchemNm() + "." + vo.getTblId();

				this.dbList.put(schemAndTable, vo);
				this.pingList.put(schemAndTable, vo.getIntervalMin());
			}
		}
	}

	/**
	 * <pre>
	 * <b style="color:red;">현재 사용되지 않습니다.</b>
	 *
	 * 현재 등록된 PingVo를 리턴합니다.
	 * </pre>
	 *
	 * @param schemAndTable
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	private GMT_PingVo getPingVo(String schemAndTable) throws Exception{

		return this.dbList.get(schemAndTable);

	}

	/**
	 * DB에 추가된 Item을 관리 목록에 추가합니다.
	 *
	 * @param vo
	 * @throws Exception
	 */
	public void addDBPingItem(GMT_PingVo vo) throws Exception{
		String schemAndTable = vo.getSchemNm() + "." + vo.getTblId();

		this.dbList.put(schemAndTable, vo);
		this.pingList.put(schemAndTable, vo.getIntervalMin());
	}

	/**
	 * 단건 Worker를 제거합니다.
	 *
	 * @param schemAndTable Schema . Table
	 * @return
	 * @throws Exception
	 */
	public boolean destroyWorker(String schemAndTable) throws Exception {
		boolean result = true;

		try {
			if ( this.pingList != null && this.taskList != null && this.timerList != null ) {
				if( this.pingList.containsKey(schemAndTable) && this.taskList.containsKey(schemAndTable) && this.timerList.containsKey(schemAndTable) ){

					Timer timer = this.timerList.get(schemAndTable);
					if( timer != null ){
						timer.cancel();
						timer = null;

						this.timerList.remove(schemAndTable);
					}

					TimerTask task = this.taskList.get(schemAndTable);
					if( task != null ){
						task.cancel();
						task = null;

						this.taskList.remove(schemAndTable);
					}

					pingList.remove(schemAndTable);
				}
			}
		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * Worker가 존재하는지 확인합니다.
	 *
	 * @param schemAndTable Schema . Table
	 * @return
	 * @throws Exception
	 */
	private boolean isExistWorker(String schemAndTable) throws Exception {
		boolean result = false;

		try {
			if ( this.pingList != null && this.taskList != null && this.timerList != null ) {
				if( this.pingList.containsKey(schemAndTable) && this.taskList.containsKey(schemAndTable) && this.timerList.containsKey(schemAndTable) ){
					result = true;
				}
			}
		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 지정된 값이 IP 형식인지 체크합니다.
	 *
	 * @param ip
	 * @return
	 */
	private boolean isIP(String ip) {
		try {
			if ( ip == null || ip.isEmpty() ) {
				return false;
			}

			String[] parts = ip.split( "\\." );
			if ( parts.length != 4 ) {
				return false;
			}

			for ( String s : parts ) {
				int i = Integer.parseInt( s );
				if ( (i < 0) || (i > 255) ) {
					return false;
				}
			}

			if ( ip.endsWith(".") ) {
				return false;
			}

			return true;
		} catch (NumberFormatException nfe) {
			return false;
		}
	}

	/**
	 * Ping 체크합니다.
	 *
	 * @param host
	 * @return
	 */
	private boolean ping(String ip) {
		if(!StringUtils.isEmpty(ip)) ip = ip.trim();

		boolean result = false;

		if(!this.isIP(ip)) {
			result = false;
		} else {
			try {
				InetAddress pingCheck = InetAddress.getByName(ip);
				result = pingCheck.isReachable(2000);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return result;
	}

	/**
	 * 단건 Worker를 추가합니다.
	 *
	 * @param GMT_PingVo
	 * @param schemAndTable Schema . Table
	 * @throws Exception
	 */
	public boolean generateWorker(GMT_PingVo vo) throws Exception {
		boolean result = true;

		try {
			String schemAndTable = vo.getSchemNm() + "." + vo.getTblId();
			Integer intervalMin = vo.getIntervalMin();

			if(intervalMin == null || intervalMin < 1){
				System.out.println(schemAndTable + " is not invalid Paramerter (intervalMin value is " + intervalMin + ")");
				return false;
			}

			if(this.isExistWorker(schemAndTable)) this.destroyWorker(schemAndTable);

			this.addDBPingItem(vo);
			this.pingList.put(schemAndTable, intervalMin);

			TimerTask task = new TimerTask() {
				@Override
				public void run() {
					try {
						String ipColumn = vo.getIpFieldEnNm();

						if(svc.isExistsTable(schemAndTable) && svc.isExistsColumn(schemAndTable, ipColumn)){
							ArrayList<HashMap<String, String>> ipList = svc.getIPList(schemAndTable, ipColumn);

							int totalCnt = ipList.size();
							int failCnt = 0;

							for(HashMap<String, String> item : ipList){
								String gid = item.get("gid");
								String ip = item.get("ip");
								boolean pingResult = ping(ip);
								if(!pingResult) failCnt++;

								try {
									HashMap<String, String> stateCd = new HashMap<String, String>();
									stateCd.put("schemAndTable", schemAndTable);
									stateCd.put("stateCd", pingResult ? "11" : "12");
									stateCd.put("gid", gid);
									svc.editStateCd(stateCd);
								} catch (Exception e) {

								}
							}

							vo.setLastWorkDat(DateUtil.getStrSec());
							vo.setTotalCnt(totalCnt);
							vo.setFailCnt(failCnt);
							svc.edit(vo);
						}else{
							destroyWorker(schemAndTable);
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			};
			this.taskList.put(schemAndTable, task);

			Timer timer = new Timer();
			timer.schedule(task, 0, ((60 * 1000) * intervalMin));
			this.timerList.put(schemAndTable, timer);

		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 초기 생성 대상 Worker를 추가합니다.
	 *
	 * @throws Exception
	 */
	private void generateAllWorker() throws Exception {
		try {
			for (Map.Entry<String, GMT_PingVo> item : this.dbList.entrySet()) {
				GMT_PingVo vo = item.getValue();

				this.generateWorker(vo);
			}
		} catch (Exception e) {
			e.printStackTrace();
			this.destroy();
		}
	}

	@PostConstruct
	private void initialize() throws Exception {
		this.dbList = new HashMap<String, GMT_PingVo>();
		this.pingList = new HashMap<String, Integer>();
		this.initializeDbPingList();

		this.timerList = new HashMap<String, Timer>();
		this.taskList = new HashMap<String, TimerTask>();

		this.generateAllWorker();
	}

	@PreDestroy
	private void destroy() throws Exception {
		if (this.timerList != null) {
			for (Map.Entry<String, Timer> item : this.timerList.entrySet()) {
				String key = item.getKey();
				Timer timer = item.getValue();

				if( timer != null ){
					timer.cancel();
					timer = null;

					this.timerList.remove(key);
				}
			}
		}

		if (this.taskList != null) {
			for (Map.Entry<String, TimerTask> item : this.taskList.entrySet()) {
				String key = item.getKey();
				TimerTask task = item.getValue();

				if( task != null ){
					task.cancel();
					task = null;

					this.taskList.remove(key);
				}
			}
		}

		if (this.pingList != null) this.pingList = null;
	}

}
