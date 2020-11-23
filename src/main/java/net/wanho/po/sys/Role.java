package net.wanho.po.sys;

import lombok.*;
import net.wanho.po.BasePo;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Role extends BasePo implements Serializable {
    private Long roleId;
    private String roleName;
    private String roleKey;
   private Integer roleSort;
    private String dataScope;
    private String status;
    private String delFlag;
}
