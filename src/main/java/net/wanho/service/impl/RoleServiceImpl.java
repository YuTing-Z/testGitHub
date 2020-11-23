package net.wanho.service.impl;

import cn.hutool.core.util.ArrayUtil;
import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.RoleMapper;
import net.wanho.po.sys.Role;
import net.wanho.po.sys.RoleMenu;
import net.wanho.po.sys.ext.RoleExt;
import net.wanho.po.sys.ext.UserExt;
import net.wanho.service.RoleServiceI;
import net.wanho.shiro.util.ShiroUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class RoleServiceImpl implements RoleServiceI {

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public List<Role> selectRoleList(Role role) {
        try {
            return roleMapper.selectRoleList(role);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

    }

    @Override
    public void insertRole(RoleExt roleExt) {
        try {
            roleExt.setCreateBy(ShiroUtils.getUserName());
            roleExt.setCreateTime(new Date());
            roleExt.setDelFlag("0");
            roleExt.setDataScope("1");
            roleMapper.insertRole(roleExt);
            insertRoleMenu(roleExt);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public RoleExt getRoleById(Long roleId) {
        try {
            RoleExt roleExt = roleMapper.getRoleById(roleId);
            roleExt.setMenuIds((Long[]) ConvertUtils.convert(roleExt.getMenuIdStr().split(","),Long.class));
            return roleExt;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateRole(RoleExt roleExt) {
        try {
            roleExt.setUpdateBy(ShiroUtils.getUserName());
            roleExt.setUpdateTime(new Date());
            roleMapper.updateRole(roleExt);
            roleMapper.deleteRoleMenuById(roleExt.getRoleId());
            insertRoleMenu(roleExt);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteRoleByIds(String ids) {
        try{
            roleMapper.deleteRoleByIds(ids.split(","));
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private void insertRoleMenu(RoleExt roleExt) {
        List<RoleMenu> roleMenuList = new ArrayList<>();
        if(ArrayUtil.isNotEmpty(roleExt.getMenuIds())){
            for (Long menuId : roleExt.getMenuIds()) {
                RoleMenu roleMenu = new RoleMenu();
                roleMenu.setRoleId(roleExt.getRoleId());
                roleMenu.setMenuId(menuId);
                roleMenuList.add(roleMenu);
            }
        }
        if(roleMenuList.size()>0){
            roleMapper.insertRoleMenu(roleMenuList);
        }
    }
}
