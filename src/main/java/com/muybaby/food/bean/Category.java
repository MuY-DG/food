package com.muybaby.food.bean;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
//类别
public class Category {
        private Integer categoryId;
        private String name;
//        @JsonSerialize(using = LocalDateTimeToSecondsSerializer.class)
        private String createdAt;
//        @JsonSerialize(using = LocalDateTimeToSecondsSerializer.class)
        private String updatedAt;



}
