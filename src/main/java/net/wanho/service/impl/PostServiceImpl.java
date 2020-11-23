package net.wanho.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.wanho.mapper.sys.PostMapper;
import net.wanho.po.sys.Post;
import net.wanho.service.PostServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class PostServiceImpl implements PostServiceI {

    @Autowired
    private PostMapper postMapper;

    @Override
    public List<Post> selectPostList(Post post) {
        try {
            return postMapper.selectPostList(post);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void insertPost(Post post) {
        try {
            post.setCreateTime(new Date());
            postMapper.insertPost(post);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public Post getPostById(Long postId) {
        try {
            return postMapper.getPostById(postId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updatePost(Post post) {
        try {
            post.setUpdateTime(new Date());
            postMapper.updatePost(post);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deletePost(String ids) {
        try {
            postMapper.deletePost(ids.split(","));
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
