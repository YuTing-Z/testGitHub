package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.Post;
import net.wanho.po.sys.Role;
import net.wanho.po.sys.User;
import net.wanho.po.sys.ext.UserExt;
import net.wanho.service.UserServiceI;
import net.wanho.shiro.util.ShiroUtils;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/sys/user")
@Slf4j
public class UserController  extends BaseController {

    private static final long serialVersionUID = 1L;

    @Autowired
    private UserServiceI userServiceI;

    @RequiresPermissions("sys:user:view")
    @GetMapping
    public ModelAndView User(){
        ModelAndView modelAndView = new ModelAndView("sys/user");
        return  modelAndView;
    }

    @PostMapping("/login")
    public AjaxResult login(User user){
        userServiceI.login(user);
        return success();
    }

    @GetMapping("/currentUser")
    public AjaxResult currentUser(){
        return success(ShiroUtils.getUser());
    }


    @RequiresPermissions("sys:user:list")
    @GetMapping("/list")
    public TableDataInfo list(UserExt userExt){
        try {
            startPage();
            List<UserExt> userList= userServiceI.selectUserList(userExt);
            return this.getTableDataInfo(userList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("UserController=list");
        }
    }

    @PostMapping
    public AjaxResult add(@RequestBody UserExt userExt){
        try {
            userServiceI.insertUser(userExt);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

    @GetMapping("/{userId}")
    public AjaxResult getUserById(@PathVariable Long userId){
        try {
            UserExt userExt= userServiceI.getUserById(userId);
            return success(userExt);
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @PutMapping
    public AjaxResult update(@RequestBody UserExt userExt){
        try {
            userServiceI.updateUser(userExt);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @DeleteMapping("/remove/{ids}")
    public AjaxResult remove(@PathVariable String ids) {
        try {
            userServiceI.deleteUserByIds(ids);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }



}
