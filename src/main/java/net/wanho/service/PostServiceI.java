package net.wanho.service;

import net.wanho.po.sys.Post;

import java.util.List;

public interface PostServiceI {
    List<Post> selectPostList(Post post);

    void insertPost(Post post);

    Post getPostById(Long postId);

    void updatePost(Post post);

    void deletePost(String ids);
}
