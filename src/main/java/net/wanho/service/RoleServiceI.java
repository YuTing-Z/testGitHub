package net.wanho.service;

import net.wanho.po.sys.Role;
import net.wanho.po.sys.ext.RoleExt;
import net.wanho.po.sys.ext.UserExt;

import java.util.List;

public interface RoleServiceI {
    List<Role> selectRoleList(Role role);

    void insertRole(RoleExt roleExt);

    RoleExt getRoleById(Long roleId);

    void updateRole(RoleExt roleExt);

    void deleteRoleByIds(String ids);

}
