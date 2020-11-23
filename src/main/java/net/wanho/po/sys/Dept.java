package net.wanho.po.sys;

import lombok.*;
import net.wanho.po.BasePo;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Dept extends BasePo implements Serializable {
      private Long deptId;
      private Long parentId;
    private String ancestors;
    private String deptName;
   private Integer orderNum;
    private String leader;
    private String phone;
    private String email;
    private String status;
    private String delFlag;
}
