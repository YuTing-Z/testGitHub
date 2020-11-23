package net.wanho.service;

import net.wanho.po.sys.Menu;
import net.wanho.po.sys.ext.MenuExt;

import java.util.Collection;
import java.util.List;

public interface MenuServiceI {
    List<Menu> selectMenuList(Menu menu);

    void insertMenu(Menu menu);

    Menu getMenuById(Long menuId);

    void updateMenu(Menu menu);

    void deleteMenu(String ids);

    Collection<String> selectPermsByUserId(Long userId);

    List<Menu> selectMenuListByUserId(Long userId);

    List<MenuExt> selectMenuExtList(Long roleId);

}
