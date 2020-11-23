package net.wanho.vo;

import lombok.Data;

@Data
public class PageVo {
    private Integer pageNum;
    private Integer pageSize;
    private String orderColumn;
    private String orderStyle;
}
