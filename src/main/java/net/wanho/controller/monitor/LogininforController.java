package net.wanho.controller.monitor;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.Logininfor;
import net.wanho.service.LogininforServiceI;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/monitor/logininfor")
@Slf4j
public class LogininforController extends BaseController {
    private static final long serialVersionUID = 1L;
    @Autowired
    private LogininforServiceI logininforServiceI;

    @RequiresPermissions("monitor:logininfor:view")
    @GetMapping()
    public ModelAndView Logininfor(){
        ModelAndView mv = new ModelAndView("/monitor/logininfor");
        return mv;
    }


    @GetMapping("/list")
    public TableDataInfo list(Logininfor logininfor) {
        try {
            startPage();
            List<Logininfor> list = logininforServiceI.selectLogininforList(logininfor);
            return this.getTableDataInfo(list);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("服务器正忙，请稍后再试");
        }
    }
}
