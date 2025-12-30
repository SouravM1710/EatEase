package com.eatease.backend.service;

import com.eatease.backend.model.Dish;
import com.eatease.backend.model.Restaurant;
import com.eatease.backend.model.Role;
import com.eatease.backend.model.Users;
import com.eatease.backend.repo.DishRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class DishService {
    private final DishRepo dishRepo;

    public DishService(DishRepo dishRepo) {
        this.dishRepo = dishRepo;
    }
    public Dish addDish(Dish dish, Restaurant restaurant, Users user) {
        if (user.getRole() != Role.OWNER && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only OWNER or ADMIN can add dishes");
        }

        if (user.getRole() != Role.ADMIN &&
                !Objects.equals(restaurant.getOwner().getId(), user.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        dish.setRestaurant(restaurant);
        return dishRepo.save(dish);
    }
    public Dish updateDish(Long dishId, Dish updatedDish,
                           Restaurant restaurant, Users user) {

        Dish existingDish = dishRepo.findById(dishId)
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        if (user.getRole() != Role.ADMIN &&
                !Objects.equals(restaurant.getOwner().getId(), user.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        existingDish.setName(updatedDish.getName());
        existingDish.setPrice(updatedDish.getPrice());

        return dishRepo.save(existingDish);
    }
    public void deleteDish(Long dishId, Restaurant restaurant, Users user) {

        Dish dish = dishRepo.findById(dishId)
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        // Ownership check
        if (user.getRole() != Role.ADMIN &&
                !Objects.equals(restaurant.getOwner().getId(), user.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        dishRepo.delete(dish);
    }
    public List<Dish> getMenu(Restaurant restaurant) {
        return dishRepo.findByRestaurant(restaurant);
    }
}
