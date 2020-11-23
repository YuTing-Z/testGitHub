package net.wanho.mapper.sys;

import net.wanho.po.sys.Menu;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MenuMapper {
    List<Menu> selectMenuList(Menu menu);

    void insertMenu(Menu menu);

    Menu getMenuById(Long menuId);

    void updateMenu(Menu menu);

    void updateAncestors(@Param("oldAncestors") String oldAncestors,@Param("newAncestors") String newAncestors,@Param("menuId") Long menuId);

    List<Menu> selectSubMenuList(String s);

    void deleteMenu(String[] idArray);

    List<Menu> selectMenuListByUserId(Long userId);

}
