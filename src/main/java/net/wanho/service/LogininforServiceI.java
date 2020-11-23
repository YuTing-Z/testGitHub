package net.wanho.service;

import lombok.extern.slf4j.Slf4j;
import net.wanho.po.sys.Logininfor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface LogininforServiceI {

    List<Logininfor> selectLogininforList(Logininfor logininfor);




}
