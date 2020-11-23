package net.wanho.mapper.sys;

import net.wanho.po.sys.DictType;

import java.util.List;

public interface DictTypeMapper {
    List<DictType> selectDictTypeList(DictType dictType);

    void insertDictType(DictType dictType);

    DictType getDictTypeById(Long dictTypeId);

}
