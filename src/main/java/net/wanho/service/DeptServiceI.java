package net.wanho.service;

import net.wanho.po.sys.Dept;

import java.util.List;

public interface DeptServiceI {
    List<Dept> selectDeptList(Dept dept);

    void insertDept(Dept dept);

    Dept getDeptById(Long deptId);

    void updateDept(Dept dept);

    void deleteDept(String ids);

}
