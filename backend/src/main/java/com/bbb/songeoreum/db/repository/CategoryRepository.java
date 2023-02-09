package com.bbb.songeoreum.db.repository;

import com.bbb.songeoreum.db.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
