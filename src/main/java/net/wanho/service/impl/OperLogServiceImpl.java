package net.wanho.service.impl;


import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.OperLogMapper;
import net.wanho.po.sys.OperLog;
import net.wanho.service.OperLogServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
* @项目名称:		[cms]
* @类名称:	    [OperLogServiceImpl]
* @类描述:	    [操作日志记录业务逻辑层实现]
* @创建人:	    [choco]
* @创建时间:		[2020-10-09 10:16:52]
* @修改人:	    []
* @修改时间:		[]
* @修改备注:		[]
* @版本:			[]
* @版权:			[]
*/
@Service
@Slf4j
public class OperLogServiceImpl implements OperLogServiceI {

	@Autowired
	private OperLogMapper operLogMapper;


	@Override
	public List<OperLog> selectOperLogList(OperLog operLog){
		try{
			return operLogMapper.selectOperLogList(operLog);
		} catch (Exception e) {
		    log.error(e.getMessage());
		    throw new RuntimeException(e);
		}
	}

}
