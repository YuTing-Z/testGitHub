package net.wanho.mapper.sys;

import net.wanho.po.sys.Role;
import net.wanho.po.sys.RoleMenu;
import net.wanho.po.sys.ext.RoleExt;

import java.util.List;

public interface RoleMapper {
    List<Role> selectRoleList(Role role);

    void insertRole(RoleExt roleExt);

    void insertRoleMenu(List<RoleMenu> roleMenuList);

    RoleExt getRoleById(Long roleId);

    List<RoleMenu> selectRoleMenuById(Long roleId);

    void updateRole(RoleExt roleExt);

    void deleteRoleMenuById(Long roleId);

    void deleteRoleByIds(String[] split);

}
