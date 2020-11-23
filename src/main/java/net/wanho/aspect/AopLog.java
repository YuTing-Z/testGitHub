package net.wanho.aspect;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import net.wanho.async.AsyncFactory;
import net.wanho.async.AsyncTask;
import net.wanho.po.sys.OperLog;
import net.wanho.util.ServletUitls;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class AopLog {
    @Pointcut("@annotation(org.springframework.web.bind.annotation.DeleteMapping)"
            + "||@annotation(org.springframework.web.bind.annotation.PostMapping)"
            + "||@annotation(org.springframework.web.bind.annotation.PutMapping)")
    public void log(){
    }

    @Around("log()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable{
        OperLog operLog = new OperLog();
        operLog.setMethod(joinPoint.getSignature().getName());
        Object res=null;
        try {
            res=joinPoint.proceed();
            operLog.setJsonResult(JSONUtil.toJsonStr(res));
            operLog.setStatus(0);
            AsyncFactory.getInstance().schedule(AsyncTask.recordOperInfor(ServletUitls.getRequest(),operLog));
        } catch (Throwable e) {
            log.error(e.getMessage());
            operLog.setErrorMsg(e.getMessage());
            operLog.setStatus(1);
            AsyncFactory.getInstance().schedule(AsyncTask.recordOperInfor(ServletUitls.getRequest(),operLog));
            throw e;
        }
        return res;
    }

}
