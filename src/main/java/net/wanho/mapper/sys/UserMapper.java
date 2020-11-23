package net.wanho.mapper.sys;

import net.wanho.po.sys.User;
import net.wanho.po.sys.UserPost;
import net.wanho.po.sys.UserRole;
import net.wanho.po.sys.ext.UserExt;

import java.util.List;

public interface UserMapper {
    List<UserExt> selectUserList(UserExt userExt);

    UserExt selectUserExt(String username);

    void insertUser(UserExt userExt);

    void insertUserRole(List<UserRole> userRoleList);

    void insertUserPost(List<UserPost> userPostList);

    UserExt getUserById(Long userId);

    void deleteUserPostById(Long userId);

    void deleteUserRoleById(Long userId);

    void updateUser(UserExt userExt);

    void deleteUserByIds(String[] split);

}
