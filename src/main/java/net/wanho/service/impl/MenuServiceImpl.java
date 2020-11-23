package net.wanho.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.MenuMapper;
import net.wanho.mapper.sys.RoleMapper;
import net.wanho.po.sys.Menu;
import net.wanho.po.sys.RoleMenu;
import net.wanho.po.sys.ext.MenuExt;
import net.wanho.service.MenuServiceI;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class MenuServiceImpl implements MenuServiceI {
    @Autowired
    private MenuMapper menuMapper;
    @Autowired
    private RoleMapper roleMapper;
    @Override
    public List<Menu> selectMenuList(Menu menu) {
        try {
            return menuMapper.selectMenuList(menu);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void insertMenu(Menu menu) {
        try {
            Long parentId = menu.getParentId();
            //如果父级ID为0，则为最高级，祖先元素为0
            if(parentId.intValue()==0){
                menu.setAncestors("0");
            }else {
                //获取到父级ID对应菜单的祖先元素，父级的祖先元素+父级ID=子祖先元素
                Menu parentMenu = menuMapper.getMenuById(parentId);
                if(ObjectUtil.isNotEmpty(parentMenu)){
                    menu.setAncestors(parentMenu.getAncestors()+","+parentId);
                }

            }
            menu.setCreateTime(new Date());
            menuMapper.insertMenu(menu);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public Menu getMenuById(Long menuId) {
        try {
            return menuMapper.getMenuById(menuId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateMenu(Menu menu) {
        try {

            Long parentId = menu.getParentId();
            String oldAncestors = menu.getAncestors();
            String newAncestors = "";
            if(parentId.intValue()==0){
                newAncestors="0";
            }else {
                Menu parentMenu = menuMapper.getMenuById(parentId);
                if(ObjectUtil.isNotEmpty(parentMenu)){
                    newAncestors=parentMenu.getAncestors()+","+parentId;
                }
            }
            menuMapper.updateAncestors(oldAncestors,newAncestors,menu.getMenuId());

            menu.setUpdateTime(new Date());
            menuMapper.updateMenu(menu);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteMenu(String ids) {
        try {
            String[] idArray = ids.split(",");
            if(ObjectUtil.isNotEmpty(idArray)&&idArray.length==1){
                List<Menu> subMenuList = menuMapper.selectSubMenuList(idArray[0]);
                if(ObjectUtil.isNotEmpty(subMenuList)&&subMenuList.size()>0){
                    throw new RuntimeException("存在下级菜单不能删除");
                }
            }
            menuMapper.deleteMenu(idArray);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<String> selectPermsByUserId(Long userId) {
        List<String> list = new ArrayList<>();
        List<Menu> menuList = menuMapper.selectMenuListByUserId(userId);
        for (Menu menu : menuList) {
            if(ObjectUtil.isNotEmpty(menu) && StrUtil.isNotEmpty(menu.getPerms())){
                list.add(menu.getPerms());
            }
        }
        return list;
    }

    @Override
    public List<Menu> selectMenuListByUserId(Long userId) {
        try {
            return menuMapper.selectMenuListByUserId(userId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<MenuExt> selectMenuExtList(Long roleId) {
        List<Menu> menuList = this.selectMenuList(new Menu());
        List<MenuExt> menuExts = new ArrayList<>(menuList.size());
        for (Menu menu : menuList) {
            MenuExt menuExt = new MenuExt();
            BeanUtils.copyProperties(menu,menuExt);
            List<RoleMenu> roleMenus = new ArrayList<>();
            roleMenus = roleMapper.selectRoleMenuById(roleId);
            for (RoleMenu roleMenu : roleMenus) {
                if(roleMenu.getMenuId().intValue()==menu.getMenuId().intValue()){
                    menuExt.setChecked(true);
                }
            }
            menuExts.add(menuExt);
        }
        return menuExts;
    }
}
