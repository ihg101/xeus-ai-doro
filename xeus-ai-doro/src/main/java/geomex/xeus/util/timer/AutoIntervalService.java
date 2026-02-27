package geomex.xeus.util.timer;

import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("autoIntervalService")
public class AutoIntervalService {

	protected Logger logger = LoggerFactory.getLogger(AutoIntervalService.class);

	private Timer reloadTimer = null;
    private TimerTask reloadTask = null;

    /*@PostConstruct
    public void init() throws Exception {
        reloadTask = new TimerTask() {
            @Override
            public void run() {
            }
        };
        reloadTimer = new Timer();
        reloadTimer.schedule(reloadTask, 10 * 1000, ((60 * 1000) * 5)); //5분에 한번씩 설정을 reload한다.
    }*/

    @PreDestroy
    public void cleanUp() throws Exception {
        if (reloadTimer != null) {
            reloadTimer.cancel();
            reloadTimer = null;
        }
    }

}
