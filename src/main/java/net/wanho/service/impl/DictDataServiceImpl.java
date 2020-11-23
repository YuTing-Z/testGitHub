package net.wanho.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.DictDataMapper;
import net.wanho.po.sys.DictData;
import net.wanho.service.DictDataServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DictDataServiceImpl implements DictDataServiceI {

    @Autowired
    private DictDataMapper dictDataMapper;

    @Override
    public List<DictData> byType(String type) {
        return dictDataMapper.byType(type);
    }

    @Override
    public List<DictData> selectDictDataList(DictData dictData) {
        try {
            return dictDataMapper.selectDictDataList(dictData);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
