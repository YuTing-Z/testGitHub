package net.wanho.shiro.filter;

import cn.hutool.json.JSONUtil;
import com.google.code.kaptcha.Constants;
import net.wanho.vo.AjaxResult;
import org.apache.shiro.web.filter.AccessControlFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;

public class KaptchaFilter extends AccessControlFilter {
    @Override
    protected boolean isAccessAllowed(ServletRequest servletRequest, ServletResponse servletResponse, Object o) throws Exception {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String inputvalidateCode = servletRequest.getParameter("validateCode");
        String genvalidateCode = (String) request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY);
        if(inputvalidateCode.equalsIgnoreCase(genvalidateCode)){
            return true;
        }
        return false;
    }

    @Override
    protected boolean onAccessDenied(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
        servletResponse.setContentType("application/json;charset=utf-8");
        PrintWriter out = servletResponse.getWriter();
        AjaxResult result = new AjaxResult(false, 500, "验证码错误！", null);
        String res = JSONUtil.toJsonStr(result);
        out.print(res);
        out.close();
        return false;
    }
}
