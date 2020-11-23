package net.wanho.mapper.sys;

import net.wanho.po.sys.Dept;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface DeptMapper {
    List<Dept> selectDeptList(Dept dept);

    void insertDept(Dept dept);

    Dept getDeptById(Long deptId);

    void updateAncestors(@Param("oldAncestors") String oldAncestors, @Param("newAncestors") String newAncestors, @Param("deptId") Long deptId);

    void updateDept(Dept dept);

    void deleteDept(String[] split);

    List<Dept> selectSubDeptList(String s);

}
