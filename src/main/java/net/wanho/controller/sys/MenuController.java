package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.Menu;
import net.wanho.po.sys.ext.MenuExt;
import net.wanho.service.MenuServiceI;
import net.wanho.shiro.util.ShiroUtils;
import net.wanho.vo.AjaxResult;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/sys/menu")
@Slf4j
public class MenuController extends BaseController {
    private static final long serialVersionUID = 1L;

    @Autowired
    private MenuServiceI menuServiceI;
    @RequiresPermissions("sys:menu:view")
    @GetMapping()
    public ModelAndView Menu(){
        ModelAndView modelAndView = new ModelAndView("sys/menu");
        return modelAndView;
    }

    /**
     * 显示树形列表
     * @return
     */
    @GetMapping("/tree")
    public ModelAndView tree(){
        ModelAndView modelAndView = new ModelAndView("sys/tree");
        return modelAndView;
    }

    /**
     * 显示目录图标
     * @return
     */
    @GetMapping("/icon")
    public ModelAndView icon(){
        ModelAndView modelAndView = new ModelAndView("sys/icon");
        return modelAndView;
    }

    @RequiresPermissions("sys:menu:list")
    @GetMapping("/list")
    public List<Menu> list(Menu menu){
        try {
            Long userId = ShiroUtils.getUser().getUserId();
            List<Menu> menuList = menuServiceI.selectMenuListByUserId(userId);
            return menuList;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("MenuController:list");
        }
    }


    @GetMapping("/findByRoleId/{roleId}/list")
    public List<MenuExt> findByRoleId(@PathVariable Long roleId){
        try {
            return menuServiceI.selectMenuExtList(roleId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("服务器正忙，请稍后再试");
        }
    }


    @RequiresPermissions("sys:menu:add")
    @PostMapping
    public AjaxResult add(@RequestBody Menu menu){
        try {
            menuServiceI.insertMenu(menu);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

    @GetMapping("/{menuId}")
    public AjaxResult getDeptById(@PathVariable Long menuId){
        try {
            Menu menu = menuServiceI.getMenuById(menuId);
            return success(menu);
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @RequiresPermissions("sys:menu:edit")
    @PutMapping
    public AjaxResult update(@RequestBody Menu menu){
        try {
            menuServiceI.updateMenu(menu);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @RequiresPermissions("sys:menu:remove")
    @DeleteMapping("/remove/{ids}")
    public AjaxResult delete(@PathVariable String ids){
        try {
            menuServiceI.deleteMenu(ids);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error(e.getMessage());
        }
    }

}
