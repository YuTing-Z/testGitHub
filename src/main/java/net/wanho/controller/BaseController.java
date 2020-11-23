package net.wanho.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.SneakyThrows;
import net.wanho.util.ServletUitls;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.PageVo;
import net.wanho.vo.TableDataInfo;
import org.apache.commons.beanutils.BeanUtils;

import java.util.List;

public class BaseController {
    public AjaxResult success(String msg, Object data) {
        AjaxResult ajaxResult = new AjaxResult(true, 200, msg, data);
        return ajaxResult;
    }

    public AjaxResult success(String msg) {
        AjaxResult ajaxResult = new AjaxResult(true, 200, msg, null);
        return ajaxResult;
    }

    public AjaxResult success(Object data) {
        AjaxResult ajaxResult = new AjaxResult(true, 200, "操作成功", data);
        return ajaxResult;
    }

    public AjaxResult success() {
        AjaxResult ajaxResult = new AjaxResult(true, 200, "操作成功", null);
        return ajaxResult;
    }

    public AjaxResult error(String msg, Object data) {
        AjaxResult ajaxResult = new AjaxResult(false, 500, msg, data);
        return ajaxResult;
    }

    public AjaxResult error(String msg) {
        AjaxResult ajaxResult = new AjaxResult(false, 500, msg, null);
        return ajaxResult;
    }

    public AjaxResult error(Object data) {
        AjaxResult ajaxResult = new AjaxResult(false, 500, "操作失败", data);
        return ajaxResult;
    }

    public AjaxResult error() {
        AjaxResult ajaxResult = new AjaxResult(false, 500, "操作失败", null);
        return ajaxResult;
    }

    @SneakyThrows
    public void   startPage(){
        PageVo pageVo = new PageVo();
        BeanUtils.populate(pageVo, ServletUitls.getRequest().getParameterMap());
        PageHelper.startPage(pageVo.getPageNum(),pageVo.getPageSize(),camelToUnderscore(pageVo.getOrderColumn())+" "+pageVo.getOrderStyle());
    }

    public TableDataInfo getTableDataInfo(List list){
        TableDataInfo tableDataInfo = new TableDataInfo();
        tableDataInfo.setTotal(new PageInfo<>(list).getTotal());
        tableDataInfo.setRows(list);
        return  tableDataInfo;

    }

    private String camelToUnderscore(String str){
        char ch=' ';
        for(int i=0;i<str.length();i++){
            ch =str.charAt(i);
            if(Character.isUpperCase(ch)){
                str=str.replace(ch+"","_"+(char) (str.charAt(i)+32));
            }
        }
        return str;
    }
}
