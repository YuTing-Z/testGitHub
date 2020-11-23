package net.wanho.controller.monitor;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.OperLog;
import net.wanho.service.OperLogServiceI;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;


@RestController
@RequestMapping("/monitor/operLog")
@Slf4j
public class OperLogController extends BaseController {
    private static final long serialVersionUID = 1L;

    @Autowired
    private OperLogServiceI operLogServiceI;

    @RequiresPermissions("monitor:operLog:view")
    @GetMapping()
    public ModelAndView OperLog() {
        ModelAndView mv = new ModelAndView("/monitor/operLog");
        return mv;
    }


    @GetMapping("/list")
    public TableDataInfo list(OperLog operLog) {
        try {
            startPage();
            List<OperLog> list = operLogServiceI.selectOperLogList(operLog);
            return this.getTableDataInfo(list);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("服务器正忙，请稍后再试");
        }
    }
}