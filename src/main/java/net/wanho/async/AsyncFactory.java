package net.wanho.async;

import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class AsyncFactory {
    private static AsyncFactory asyncFactory = new AsyncFactory();

    public AsyncFactory() {
    }
    public static AsyncFactory getInstance(){
        return asyncFactory;
    }

    ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(20);

    public void schedule(TimerTask timerTask) {
        scheduledExecutorService.schedule(timerTask,0, TimeUnit.MILLISECONDS);
    }
}
