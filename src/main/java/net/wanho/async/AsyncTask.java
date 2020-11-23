package net.wanho.async;

import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
import net.wanho.mapper.sys.LogininforMapper;
import net.wanho.mapper.sys.OperLogMapper;
import net.wanho.po.sys.Logininfor;
import net.wanho.po.sys.OperLog;
import net.wanho.shiro.util.ShiroUtils;
import net.wanho.util.AddressUtils;
import net.wanho.util.SpringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.TimerTask;

public class AsyncTask {
    /**
     * 登陆日志
     */
    public static TimerTask recordLogininfor(final HttpServletRequest request, final String name, final String status, final String msg){

        final UserAgent userAgent = UserAgentUtil.parse(request.getHeader("User-Agent"));

        return new TimerTask() {
            @Override
            public void run() {
                LogininforMapper logininforMapper = SpringUtils.getBean(LogininforMapper.class);
                Logininfor logininfor = new Logininfor();
                logininfor.setUserName(name);
                logininfor.setIpaddr(AddressUtils.getIpAddr(request));
                logininfor.setLoginLocation(AddressUtils.getRealAddressByIp(logininfor.getIpaddr()));
                logininfor.setBrowser(userAgent.getBrowser().getName());
                logininfor.setOs(userAgent.getOs().getName());
                logininfor.setStatus(status);
                logininfor.setMsg(msg);
                logininfor.setLoginTime(new Date());
                logininforMapper.insertLogininfor(logininfor);
            }
        };
    }

    /**
     * 操作日志
     */
    public static TimerTask recordOperInfor(final HttpServletRequest request, final OperLog operLog){
        final OperLogMapper operLogMapper = SpringUtils.getBean(OperLogMapper.class);
        return new TimerTask() {
            @Override
            public void run() {
                String requestURL = request.getRequestURI().toString();
                if(requestURL.endsWith("/sys/user/login")){
                    return;
                }
                String method = request.getMethod();
                Integer businessType=0;
                operLog.setTitle(requestURL.split("\\/")[3]);
                if(method.equalsIgnoreCase("POST")){
                    businessType=1;
                }else if(method.equalsIgnoreCase("DELETE")){
                    businessType=3;
                }else if(method.equalsIgnoreCase("PUT")){
                    businessType=2;
                }
                operLog.setBusinessType(businessType);
                operLog.setRequestMethod(method);
                operLog.setOperatorType(1);
                operLog.setOperName(ShiroUtils.getUserName());
                operLog.setDeptName(ShiroUtils.getUser().getDept().getDeptName());
                operLog.setOperUrl(requestURL);
                operLog.setOperIp(AddressUtils.getIpAddr(request));
                operLog.setOperLocation(AddressUtils.getRealAddressByIp(AddressUtils.getIpAddr(request)));
                operLog.setOperTime(new Date());
                operLogMapper.insertOperLog(operLog);
            }
        };
    }

}
