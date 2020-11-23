package net.wanho.service;

import net.wanho.po.sys.DictType;

import java.util.List;

public interface DictTypeServiceI {
    List<DictType> selectDictTypeList(DictType dictType);

    void insertDictType(DictType dictType);

    DictType getDictTypeById(Long dictTypeId);
}
