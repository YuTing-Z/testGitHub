package net.wanho.po.sys;

import lombok.*;
import net.wanho.po.BasePo;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Menu extends BasePo implements Serializable {
    private Long menuId;
    private String menuName;
    private Long parentId;
    private String ancestors;
    private Integer orderNum;
    private String url;
    private String target;
    private String menuType;
    private String visible;
    private String perms;
    private String icon;

}
