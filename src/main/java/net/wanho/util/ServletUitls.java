package net.wanho.util;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet工具类
 */
public class ServletUitls {
    public static ServletRequestAttributes getRequestAttributes(){
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        return  (ServletRequestAttributes)requestAttributes;
    }

    /**
     * 获取HttpServletRequest
     * @return
     */
    public static HttpServletRequest getRequest(){
        HttpServletRequest request = getRequestAttributes().getRequest();
        return request;
    }

    /**
     * 获取HttpServletResponse
     * @return
     */
    public static HttpServletResponse getResponse(){
        HttpServletResponse response =getRequestAttributes().getResponse();
        return response;
    }
}
