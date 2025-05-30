package com.muybaby.food.bean;


import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class User {
    private Integer userId;
    private String username;
    private String passwordHash;
    private String email;
    private String phone;
    private String role;
//    @JsonSerialize(using = LocalDateTimeToSecondsSerializer.class)
    private String createdAt;  // 直接存储秒级时间戳
//    @JsonSerialize(using = LocalDateTimeToSecondsSerializer.class)
    private String updatedAt;

    // 添加默认构造函数
//    public User() {
//    }

//    public User(Integer userId, String username, String passwordHash, String email, String phone, String role, String createdAt, String updatedAt) {
//        this.userId = userId;
//        this.username = username;
//        this.passwordHash = passwordHash;
//        this.email = email;
//        this.phone = phone;
//        this.role = role;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//    }

}