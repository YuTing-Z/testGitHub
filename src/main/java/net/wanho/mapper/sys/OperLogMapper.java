package net.wanho.mapper.sys;

import net.wanho.po.sys.OperLog;

import java.util.List;

public interface OperLogMapper {
    void insertOperLog(OperLog operLog);

    List<OperLog> selectOperLogList(OperLog operLog);


}
