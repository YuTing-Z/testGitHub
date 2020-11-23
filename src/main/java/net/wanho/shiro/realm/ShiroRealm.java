package net.wanho.shiro.realm;

import cn.hutool.core.util.ObjectUtil;
import net.wanho.mapper.sys.UserMapper;
import net.wanho.po.sys.User;
import net.wanho.po.sys.ext.UserExt;
import net.wanho.service.MenuServiceI;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

public class ShiroRealm extends AuthorizingRealm {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private MenuServiceI menuServiceI;
    /**
     * 认证——登陆
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        String username = token.getUsername();
        UserExt userExt = userMapper.selectUserExt(username);
        if(ObjectUtil.isNotEmpty(userExt)){
            if(userExt.getDelFlag().equals("2")){
                throw new RuntimeException("用户已经被删除！");
            }
            if(userExt.getStatus().equals("1")){
                throw new RuntimeException("用户已经被停用！");
            }
            return new SimpleAuthenticationInfo(userExt,userExt.getPassword(), ByteSource.Util.bytes(userExt.getSalt()),this.getName());
        }
        return null;
    }

    /**
     * 授权
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        User user = (User) principalCollection.getPrimaryPrincipal();
        Long userId = user.getUserId();
        simpleAuthorizationInfo.addStringPermissions(menuServiceI.selectPermsByUserId(userId));
        return simpleAuthorizationInfo;
    }


}
