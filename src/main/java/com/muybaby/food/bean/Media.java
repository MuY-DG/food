package com.muybaby.food.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {
    /**
     * 媒体资源的唯一标识符。
     */
    private Long mediaId;

    /**
     * 关联的菜品标识符。
     */
    private Long dishId;

    /**
     * 图片的URL地址。
     */
    private String imageUrl;

    /**
     * 记录创建的时间戳。
     */
    private LocalDateTime createdAt;
}
