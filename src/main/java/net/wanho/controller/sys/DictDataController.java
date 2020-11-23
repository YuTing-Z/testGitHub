package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.DictData;
import net.wanho.po.sys.DictType;
import net.wanho.service.DictDataServiceI;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sys/dictData")
@Slf4j
public class DictDataController extends BaseController {
    private static final long serialVersionUID = 1L;

    @Autowired
    private DictDataServiceI dictDataServiceI;

    @GetMapping("/byType")
    public AjaxResult byType(String type){
        return success("根据类型查询",dictDataServiceI.byType(type));
    }

    @GetMapping("/list")
    public TableDataInfo list(DictData dictData){
        try {
            startPage();
            List<DictData> dictDataList= dictDataServiceI.selectDictDataList(dictData);
            return this.getTableDataInfo(dictDataList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("DictDataController=list");
        }
    }

}
