package net.wanho.service.impl;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.RandomUtil;
import lombok.extern.slf4j.Slf4j;
import net.wanho.async.AsyncFactory;
import net.wanho.async.AsyncTask;
import net.wanho.mapper.sys.UserMapper;
import net.wanho.po.sys.User;
import net.wanho.po.sys.UserPost;
import net.wanho.po.sys.UserRole;
import net.wanho.po.sys.ext.UserExt;
import net.wanho.service.UserServiceI;
import net.wanho.shiro.util.ShiroUtils;
import net.wanho.util.ServletUitls;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class UserServiceImpl implements UserServiceI {

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserExt> selectUserList(UserExt userExt) {
        try {
            return userMapper.selectUserList(userExt);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void login(User user) {
        Subject subject = SecurityUtils.getSubject();
        String msg="";
        UsernamePasswordToken token = new UsernamePasswordToken(user.getUserName(), user.getPassword());
        try {
            subject.login(token);
            AsyncFactory.getInstance().schedule(AsyncTask.recordLogininfor(ServletUitls.getRequest(),user.getUserName(),"0","登录成功"));
        } catch (IncorrectCredentialsException e) {
            msg="用户名或密码不正确";
            AsyncFactory.getInstance().schedule(AsyncTask.recordLogininfor(ServletUitls.getRequest(),user.getUserName(),"1",msg));
            throw new RuntimeException(msg);
        }catch (UnknownAccountException e) {
            msg="用户名不存在";
            AsyncFactory.getInstance().schedule(AsyncTask.recordLogininfor(ServletUitls.getRequest(),user.getUserName(),"1",msg));
            throw new RuntimeException(msg);
        }catch (AuthenticationException e) {
            msg=e.getMessage();
            AsyncFactory.getInstance().schedule(AsyncTask.recordLogininfor(ServletUitls.getRequest(),user.getUserName(),"1",msg));
            throw new RuntimeException(msg);
        }
    }

    @Override
    public void insertUser(UserExt userExt) {
        try {
            userExt.setDeptId(userExt.getDept().getDeptId());
            userExt.setCreateBy(ShiroUtils.getUserName());
            userExt.setCreateTime(new Date());
            userExt.setSalt(RandomUtil.randomNumbers(6));
            userExt.setPassword(new Md5Hash(userExt.getPassword(),userExt.getSalt(),1024).toHex());
            userMapper.insertUser(userExt);

            //用户岗位表添加数据
            insertUserPost(userExt);

            //用户角色表添加数据
            insertUserRole(userExt);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserExt getUserById(Long userId) {
        try {
            UserExt userExt = userMapper.getUserById(userId);
            List<UserPost> userPostList = userExt.getUserPostList();
            List<UserRole> userRoleList = userExt.getUserRoleList();

            Long[] postIds = new Long[userPostList.size()];
            for(int i=0;i<userPostList.size();i++){
                postIds[i]=userPostList.get(i).getPostId();
            }

            Long[] roleIds = new Long[userRoleList.size()];
            for(int i=0;i<userRoleList.size();i++){
                roleIds[i]=userRoleList.get(i).getRoleId();
            }

            userExt.setRoleIds(roleIds);
            userExt.setPostIds(postIds);
            return  userExt;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateUser(UserExt userExt) {
        userExt.setUpdateBy(ShiroUtils.getUserName());
        userExt.setUpdateTime(new Date());
        Long userId = userExt.getUserId();
        User dbUserExt = userMapper.getUserById(userId);
        if(!dbUserExt.getPassword().equalsIgnoreCase(userExt.getPassword())){
            userExt.setPassword(ShiroUtils.getEncryptPass(userExt.getPassword(),dbUserExt.getSalt()));
        }

        userMapper.deleteUserPostById(userId);
        insertUserPost(userExt);

        userMapper.deleteUserRoleById(userId);
        insertUserRole(userExt);

        userExt.setDeptId(userExt.getDept().getDeptId());
        userMapper.updateUser(userExt);
    }

    @Override
    public void deleteUserByIds(String ids) {
        try{
            userMapper.deleteUserByIds(ids.split(","));
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    /**
     * 用户角色表添加数据
     * @param userExt
     */
    private void insertUserRole(UserExt userExt) {
        List<UserRole> userRoleList = new ArrayList<>();
        if(ArrayUtil.isNotEmpty(userExt.getRoleIds())){
            for (Long roleId : userExt.getRoleIds()) {
                UserRole userRole = new UserRole();
                userRole.setRoleId(roleId);
                userRole.setUserId(userExt.getUserId());
                userRoleList.add(userRole);
            }
        }
        if(userRoleList.size()>0){
            userMapper.insertUserRole(userRoleList);
        }
    }

    /**
     * 用户岗位表添加数据
     * @param userExt
     */
    private void insertUserPost(UserExt userExt) {
        List<UserPost> userPostList = new ArrayList<>();
        if(ArrayUtil.isNotEmpty(userExt.getPostIds())){
            for (Long postId : userExt.getPostIds()) {
                UserPost userPost = new UserPost();
                userPost.setPostId(postId);
                userPost.setUserId(userExt.getUserId());
                userPostList.add(userPost);
            }
        }
        if(userPostList.size()>0){
            userMapper.insertUserPost(userPostList);
        }
    }
}
