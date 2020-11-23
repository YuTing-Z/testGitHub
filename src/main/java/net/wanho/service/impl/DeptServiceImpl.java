package net.wanho.service.impl;

import cn.hutool.core.util.ObjectUtil;
import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.DeptMapper;
import net.wanho.po.sys.Dept;
import net.wanho.service.DeptServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class DeptServiceImpl implements DeptServiceI {

    @Autowired
    private DeptMapper deptMapper;

    @Override
    public List<Dept> selectDeptList(Dept dept) {
        try {
            return deptMapper.selectDeptList(dept);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void insertDept(Dept dept) {
        try {

            Long parentId = dept.getParentId();
            if(parentId.intValue()==0){
                dept.setAncestors("0");
            }else {
                Dept parentDept = deptMapper.getDeptById(parentId);
                if(ObjectUtil.isNotEmpty(parentDept)){
                    dept.setAncestors(parentDept.getAncestors()+","+parentId);
                }
            }

            dept.setCreateTime(new Date());
            deptMapper.insertDept(dept);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public Dept getDeptById(Long deptId) {
        try {
            return deptMapper.getDeptById(deptId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateDept(Dept dept) {
        try {

            Long parentId = dept.getParentId();
            String oldAncestors = dept.getAncestors();
            String newAncestors = "";
            if(parentId.intValue()==0){
                newAncestors="0";
            }else {
                Dept parentDept = deptMapper.getDeptById(parentId);
                if(ObjectUtil.isNotEmpty(parentDept)){
                    newAncestors=parentDept.getAncestors()+","+parentId;
                }
            }
            deptMapper.updateAncestors(oldAncestors,newAncestors,dept.getDeptId());

            dept.setUpdateTime(new Date());
            deptMapper.updateDept(dept);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteDept(String ids) {
        try {
            String[] idArray = ids.split(",");
            if(ObjectUtil.isNotEmpty(idArray)&&idArray.length==1){
                List<Dept> subDeptList = deptMapper.selectSubDeptList(idArray[0]);
                if(ObjectUtil.isNotEmpty(subDeptList)&&subDeptList.size()>0){
                    throw new RuntimeException("存在下级部门不可删除");
                }
            }
            deptMapper.deleteDept(idArray);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }


}
