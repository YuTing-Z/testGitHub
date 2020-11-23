package net.wanho.controller;
import com.google.code.kaptcha.Constants;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import lombok.SneakyThrows;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.util.Properties;

@Controller
@RequestMapping("/kaptcha")
public class KaptchaController {

    private DefaultKaptcha defaultKaptcha;

    {
        defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        // 是否有边框  默认为true  我们可以自己设置yes，no
        properties.setProperty("kaptcha.border", "yes");
        // 边框颜色   默认为Color.BLACK
        properties.setProperty("kaptcha.border.color", "105,179,90");
        // 验证码文本字符颜色  默认为Color.BLACK
        properties.setProperty("kaptcha.textproducer.font.color", "blue");
        // 验证码图片宽度  默认为200
        properties.setProperty("kaptcha.image.width", "160");
        // 验证码图片高度  默认为50
        properties.setProperty("kaptcha.image.height", "60");
        // 验证码文本字符大小  默认为40
        properties.setProperty("kaptcha.textproducer.font.size", "30");
        // KAPTCHA_SESSION_KEY
        properties.setProperty("kaptcha.session.key", "kaptchaCode");
        // 验证码文本字符间距  默认为2
        properties.setProperty("kaptcha.textproducer.char.space", "3");
        // 验证码文本字符长度  默认为5
        properties.setProperty("kaptcha.textproducer.char.length", "5");
        // 验证码文本字体样式  默认为new Font("Arial", 1, fontSize), new Font("Courier", 1, fontSize)
        properties.setProperty("kaptcha.textproducer.font.names", "Arial,Courier");
        // 验证码噪点颜色   默认为Color.BLACK
        properties.setProperty("kaptcha.noise.color", "white");
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
    }


    /**
     * 获取验证码
     * @param request
     * @param response
     * @return
     */
    @SneakyThrows
    @GetMapping(value = "/kaptchaImage")
    public void getKaptchaImage(HttpServletRequest request, HttpServletResponse response) {

        // 不使用缓存
        response.setDateHeader("Expires", 0);
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        response.setHeader("Pragma", "no-cache");
        // 响应图片
        response.setContentType("image/jpeg");

        // 创建随机文件
        String capStr = defaultKaptcha.createText();
        // 把验证码放到session
        request.getSession().setAttribute(Constants.KAPTCHA_SESSION_KEY,capStr);
        // 把文本变成图片
        BufferedImage bi = defaultKaptcha.createImage(capStr);

        ServletOutputStream out = response.getOutputStream();
        ImageIO.write(bi, "jpg", out) ;
        out.close();
    }
}