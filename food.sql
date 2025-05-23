create table category
(
    category_id int auto_increment comment '分类唯一标识'
        primary key,
    name        varchar(50)                        not null comment '分类名称（唯一）',
    created_at  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint uk_name
        unique (name)
)
    comment '美食分类表';

create table user
(
    user_id       bigint auto_increment comment '用户唯一标识'
        primary key,
    username      varchar(50)                                      not null comment '用户名（唯一）',
    password_hash varchar(255)                                     not null comment 'BCrypt加密密码',
    email         varchar(100)                                     not null comment '验证邮箱（唯一）',
    phone         varchar(20)                                      null,
    role          enum ('USER', 'ADMIN') default 'USER'            not null comment '用户角色',
    created_at    datetime               default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at    datetime               default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint email
        unique (email),
    constraint phone
        unique (phone),
    constraint uk_username
        unique (username)
)
    comment '用户信息表';

create table dish
(
    dish_id          bigint auto_increment comment '菜品唯一标识'
        primary key,
    title            varchar(100)                       not null comment '菜品名称',
    category_id      int                                not null comment '所属分类ID',
    user_id          bigint                             not null comment '创建者ID',
    markdown_content text                               not null comment 'Markdown格式菜品详情',
    cover_image      varchar(255)                       null comment '封面图URL',
    created_at       datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at       datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    clicks           int      default 0                 not null comment '点击量',
    constraint fk_dish_category
        foreign key (category_id) references category (category_id),
    constraint fk_dish_user
        foreign key (user_id) references user (user_id)
)
    comment '菜品信息表';

create table media
(
    media_id   bigint auto_increment comment '媒体资源ID'
        primary key,
    dish_id    bigint                             not null comment '关联菜品ID',
    image_url  varchar(255)                       not null comment '图片地址',
    created_at datetime default CURRENT_TIMESTAMP not null comment '上传时间',
    constraint fk_media_dish
        foreign key (dish_id) references dish (dish_id)
)
    comment '菜品图片表';

