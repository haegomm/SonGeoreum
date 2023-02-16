package com.bbb.songeoreum.oauth.service;

import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.UserNotFoundException;
import com.bbb.songeoreum.oauth.entity.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.debug("loadUserByUsername 호출, 넘어온 username : {}", username);

        User user = userRepository.findByNickname(username).orElseThrow(() -> new UserNotFoundException());

        return PrincipalDetails.create(user);
    }
}
