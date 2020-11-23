package net.wanho.mapper.sys;

import net.wanho.po.sys.Post;

import java.util.List;

public interface PostMapper {
    List<Post> selectPostList(Post post);

    void insertPost(Post post);

    Post getPostById(Long postId);

    void updatePost(Post post);

    void deletePost(String[] ids);

}
