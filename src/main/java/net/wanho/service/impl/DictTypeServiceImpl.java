package net.wanho.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.DictTypeMapper;
import net.wanho.po.sys.DictType;
import net.wanho.service.DictTypeServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DictTypeServiceImpl implements DictTypeServiceI {
    @Autowired
    private DictTypeMapper dictTypeMapper;
    @Override
    public List<DictType> selectDictTypeList(DictType dictType) {
        try {
            return dictTypeMapper.selectDictTypeList(dictType);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void insertDictType(DictType dictType) {
        try {
            dictTypeMapper.insertDictType(dictType);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public DictType getDictTypeById(Long dictTypeId) {
        try {
            return dictTypeMapper.getDictTypeById(dictTypeId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
