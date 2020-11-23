package net.wanho.controller;

import net.wanho.vo.AjaxResult;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {
    @ExceptionHandler(UnauthorizedException.class)
    public AjaxResult handleException(UnauthorizedException e){

        return new AjaxResult(false,500,"没有权限，请联系管理员",null);
    }
    @ExceptionHandler(Exception.class)
    public AjaxResult handleException(Exception e){
        return new AjaxResult(false,500,e.getMessage(),null);
    }
}
