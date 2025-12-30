package com.eatease.backend.service;

import com.eatease.backend.model.UserPrincipal;
import com.eatease.backend.model.Users;
import com.eatease.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;

    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        String normalizedUsername = username.toLowerCase().trim();

        Users user = userRepo.findByUsername(normalizedUsername)
                .orElseThrow(() -> {
                    System.out.println("User Not Found: " + normalizedUsername);
                    return new UsernameNotFoundException("User not found");
                });

        return new UserPrincipal(user);
    }
}
