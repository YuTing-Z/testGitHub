package net.wanho.controller.sys;

import lombok.extern.slf4j.Slf4j;
import net.wanho.controller.BaseController;
import net.wanho.po.sys.Post;
import net.wanho.service.PostServiceI;
import net.wanho.vo.AjaxResult;
import net.wanho.vo.TableDataInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/sys/post")
@Slf4j
public class PostController extends BaseController {

    private static final long serialVersionUID = 1L;

    @Autowired
    private PostServiceI postServiceI;

    @RequiresPermissions("sys:post:view")
    @GetMapping
    public ModelAndView Post(){
        ModelAndView modelAndView = new ModelAndView("sys/post");
        return  modelAndView;
    }

    /**
     * 查询所有岗位——岗位管理模块
     * @param post
     * @return
     */
    @RequiresPermissions("sys:post:list")
    @GetMapping("/list")
    public TableDataInfo list(Post post){
        try {
            startPage();
            List<Post> postList= postServiceI.selectPostList(post);
            return this.getTableDataInfo(postList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("PostController=list");
        }
    }

    /**
     *查询所有岗位——用户管理模块——新增或修改用户
     * @param post
     * @return
     */
    @GetMapping("/listAll")
    public AjaxResult listAll(Post post){
        try {
            List<Post> postList= postServiceI.selectPostList(post);
            return success(postList);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("PostController=listAll");
        }
    }

    @RequiresPermissions("sys:post:add")
    @PostMapping
    public AjaxResult add(@RequestBody Post post){
        try {
            postServiceI.insertPost(post);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }

    }

    @GetMapping("/{postId}")
    public AjaxResult getPostById(@PathVariable Long postId){
        try {
            Post post = postServiceI.getPostById(postId);
            return success(post);
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

    @RequiresPermissions("sys:post:edit")
    @PutMapping
    public AjaxResult update(@RequestBody Post post){
        try {
            postServiceI.updatePost(post);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }


    @RequiresPermissions("sys:post:remove")
    @DeleteMapping("/remove/{ids}")
    public AjaxResult delete(@PathVariable String ids){
        try {
            postServiceI.deletePost(ids);
            return success();
        } catch (Exception e) {
            log.error(e.getMessage());
            return error();
        }
    }

}
