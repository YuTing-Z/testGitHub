package net.wanho.mapper.sys;

import net.wanho.po.sys.Logininfor;

import java.util.List;

public interface LogininforMapper {
    void insertLogininfor(Logininfor logininfor);


    List<Logininfor> selectLogininforList(Logininfor logininfor);


}
