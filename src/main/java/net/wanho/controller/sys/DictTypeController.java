package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.DictType;
import net.wanho.po.sys.Post;
import net.wanho.service.DictTypeServiceI;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/sys/dictType")
@Slf4j
public class DictTypeController  extends BaseController {
    private static final long serialVersionUID = 1L;
    @Autowired
    private DictTypeServiceI dictTypeServiceI;

    @RequiresPermissions("sys:dict:view")
    @GetMapping
    public ModelAndView DictType(){
        ModelAndView modelAndView = new ModelAndView("sys/dictType");
        return  modelAndView;
    }
    @GetMapping("/dictData")
    public ModelAndView DictData(){
        ModelAndView modelAndView = new ModelAndView("sys/dictData");
        return  modelAndView;
    }

    @RequiresPermissions("sys:dict:list")
    @GetMapping("/list")
    public TableDataInfo list(DictType dictType){
        try {
            startPage();
            List<DictType> dictTypeList= dictTypeServiceI.selectDictTypeList(dictType);
            return this.getTableDataInfo(dictTypeList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("DictTypeController=list");
        }
    }

    @RequiresPermissions("sys:dict:add")
    @PostMapping
    public AjaxResult add(@RequestBody DictType dictType){
        try {
            dictTypeServiceI.insertDictType(dictType);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }


    }


    @GetMapping("/{dictTypeId}")
    public AjaxResult getDictTypeById(@PathVariable Long dictTypeId){
        try {
            DictType dictType = dictTypeServiceI.getDictTypeById(dictTypeId);
            return success(dictType);
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }
}
