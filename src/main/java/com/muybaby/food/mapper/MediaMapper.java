package com.muybaby.food.mapper;
import org.apache.ibatis.annotations.Mapper;



@Mapper
public interface MediaMapper {
    int deleteMediaBydishId(Long dishId);
}
