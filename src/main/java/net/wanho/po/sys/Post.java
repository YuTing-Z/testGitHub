package net.wanho.po.sys;

import lombok.*;
import net.wanho.po.BasePo;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Post extends BasePo implements Serializable {
    private Long postId;
    private Long postLevel;
    private String postCode;
    private String postName;
    private Integer postSort;
    private String status;
}
