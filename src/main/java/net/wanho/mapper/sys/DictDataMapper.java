package net.wanho.mapper.sys;

import net.wanho.po.sys.DictData;

import java.util.List;

public interface DictDataMapper {
    List<DictData> byType(String type);

    List<DictData> selectDictDataList(DictData dictData);

}
