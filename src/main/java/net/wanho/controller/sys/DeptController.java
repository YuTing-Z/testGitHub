package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.Dept;
import net.wanho.service.DeptServiceI;
import net.wanho.vo.AjaxResult;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/sys/dept")
@Slf4j
public class DeptController extends BaseController {
    private static final long serialVersionUID = 1L;

    @Autowired
    private DeptServiceI deptServiceI;

    @GetMapping()
    @RequiresPermissions("sys:dept:view")
    public ModelAndView Dept(){
        ModelAndView modelAndView = new ModelAndView("sys/dept");
        return modelAndView;
    }
    @RequiresPermissions("sys:dept:list")
    @GetMapping("/list")
    public List<Dept> list(Dept dept){
        try {
            return deptServiceI.selectDeptList(dept);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("DeptController:list");
        }
    }

    @GetMapping("/tree")
    public ModelAndView tree(){
        ModelAndView modelAndView = new ModelAndView("sys/tree");
        return modelAndView;
    }

    @RequiresPermissions("sys:dept:add")
    @PostMapping
    public AjaxResult add(@RequestBody Dept dept){
        try {
            deptServiceI.insertDept(dept);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

    @GetMapping("/{deptId}")
    public AjaxResult getDeptById(@PathVariable Long deptId){
        try {
            Dept dept = deptServiceI.getDeptById(deptId);
            return success(dept);
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

    @RequiresPermissions("sys:dept:edit")
    @PutMapping
    public AjaxResult update(@RequestBody Dept dept){
        try {
            deptServiceI.updateDept(dept);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @RequiresPermissions("sys:dept:remove")
    @DeleteMapping("/remove/{ids}")
    public AjaxResult delete(@PathVariable String ids){
        try {
            deptServiceI.deleteDept(ids);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error(e.getMessage());
        }
    }

}
