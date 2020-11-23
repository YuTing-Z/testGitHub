package net.wanho.po.sys;

import lombok.*;
import net.wanho.po.BasePo;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class DictType extends BasePo implements Serializable {
    private Long dictId;
    private String dictName;
    private String dictType;
    private String status;
}
