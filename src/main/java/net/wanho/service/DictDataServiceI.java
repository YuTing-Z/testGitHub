package net.wanho.service;

import net.wanho.po.sys.DictData;
import net.wanho.po.sys.DictType;

import java.util.List;

public interface DictDataServiceI {

    List<DictData> byType(String type);

    List<DictData> selectDictDataList(DictData dictData);

}
