package net.wanho.po.sys.ext;

import lombok.Data;
import net.wanho.po.sys.Role;
@Data
public class RoleExt extends Role {
    private Long []menuIds;
    private String menuIdStr;
}
