package com.eatease.backend.service;

import com.eatease.backend.model.Restaurant;
import com.eatease.backend.model.Role;
import com.eatease.backend.model.Users;
import com.eatease.backend.repo.RestaurantRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class RestaurantService {
    private final RestaurantRepo restaurantRepo;

    public RestaurantService(RestaurantRepo restaurantRepo) {
        this.restaurantRepo = restaurantRepo;
    }

    public Restaurant createRestaurant(Restaurant restaurant, Users owner) {

        if (owner.getRole() != Role.OWNER && owner.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only OWNER or ADMIN can create restaurants");
        }

        restaurant.setOwner(owner);
        return restaurantRepo.save(restaurant);
    }

    public List<Restaurant> getRestaurantsForOwner(Users owner) {
        return restaurantRepo.findByOwner(owner);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepo.findAll();
    }
    public Restaurant getById(Long id) {
        return restaurantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }
    public void deleteRestaurant(Long restaurantId, Users user) {

        Restaurant restaurant = getById(restaurantId);

        if (!Objects.equals(restaurant.getOwner().getId(), user.getId())
                && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }
        restaurantRepo.delete(restaurant);
    }
}
