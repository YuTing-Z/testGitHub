package net.wanho.service;

import net.wanho.po.sys.OperLog;

import java.util.List;

/**
* @项目名称:	    [cms]
* @类名称:	    [OperLogServiceI]
* @类描述:	    [操作日志记录业务逻辑层接口]
* @创建人:	    [choco]
* @创建时间:	    [2020-10-09 10:16:52]
* @修改人:	    []
* @修改时间:	    []
* @修改备注:	    []
* @版本:		    []
* @版权:		    []
*/
public interface OperLogServiceI {

    List<OperLog> selectOperLogList(OperLog operLog);

}
