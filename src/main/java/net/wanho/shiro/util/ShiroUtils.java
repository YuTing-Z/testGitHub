package net.wanho.shiro.util;

import cn.hutool.core.util.ObjectUtil;
import net.wanho.po.sys.ext.UserExt;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.crypto.hash.Md5Hash;

public class ShiroUtils {
    public static String getUserName(){
        UserExt user = getUser();
        if(ObjectUtil.isNotEmpty(user)){
            return user.getUserName();
        }
        return null;
    }

    public static UserExt getUser(){
        UserExt userExt = (UserExt) SecurityUtils.getSubject().getPrincipal();
        return userExt;
    }

    public static String getEncryptPass(String password, String salt) {
        return new Md5Hash(password,salt,1024).toHex();
    }
}
