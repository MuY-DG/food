package com.muybaby.food.mapper;

import com.muybaby.food.bean.Category;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;


@Mapper
public interface CategoryMapper {
    int insertCategory(Category category);
    int deleteById(Integer categoryId);
    int updateCategory(Category category);
    List<Category> selectAll();
    Category selectById(Integer id);
    boolean existsByName(String name);
    boolean existsByNameAndNotId(Category category);
    boolean selectIdIfExists(Integer categoryId);
}
