package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.Post;
import net.wanho.po.sys.Role;
import net.wanho.po.sys.ext.RoleExt;
import net.wanho.po.sys.ext.UserExt;
import net.wanho.service.RoleServiceI;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/sys/role")
@Slf4j
public class RoleController extends BaseController {
    private static final long serialVersionUID = 1L;

    @Autowired
    private RoleServiceI roleServiceI;

    @RequiresPermissions("sys:role:view")
    @GetMapping
    public ModelAndView Role(){
        ModelAndView modelAndView = new ModelAndView("sys/role");
        return  modelAndView;
    }

    @RequiresPermissions("sys:role:list")
    @GetMapping("/list")
    public TableDataInfo list(Role role){
        try {
            startPage();
            List<Role> roleList= roleServiceI.selectRoleList(role);
            return this.getTableDataInfo(roleList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("RoleController=list");
        }
    }

    @GetMapping("/listAll")
    public AjaxResult listAll(Role role){
        try {
            List<Role> roleList= roleServiceI.selectRoleList(role);
            return success(roleList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("RoleController=listAll");
        }
    }


    @PostMapping
    public AjaxResult add(@RequestBody RoleExt roleExt){
        try {
            roleServiceI.insertRole(roleExt);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

    @GetMapping("/{roleId}")
    public AjaxResult getRoleById(@PathVariable Long roleId){
        try {
            RoleExt roleExt= roleServiceI.getRoleById(roleId);
            return success(roleExt);
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @PutMapping
    public AjaxResult update(@RequestBody RoleExt roleExt){
        try {
            roleServiceI.updateRole(roleExt);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @DeleteMapping("/remove/{ids}")
    public AjaxResult remove(@PathVariable String ids) {
        try {
            roleServiceI.deleteRoleByIds(ids);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

}
