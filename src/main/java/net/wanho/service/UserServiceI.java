package net.wanho.service;

import net.wanho.po.sys.User;
import net.wanho.po.sys.ext.UserExt;

import java.util.List;

public interface UserServiceI {
    List<UserExt> selectUserList(UserExt userExt);

    void login(User user);

    void insertUser(UserExt userExt);

    UserExt getUserById(Long userId);

    void updateUser(UserExt userExt);

    void deleteUserByIds(String ids);

}
