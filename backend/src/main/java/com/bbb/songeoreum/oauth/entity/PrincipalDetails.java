package com.bbb.songeoreum.oauth.entity;

import com.bbb.songeoreum.db.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
// Security Session 에서  => Authentication 이걸 꺼내고 => UserDetails(PrincipalDetails) 객체를 꺼내면 user에 접근할 수 있음.
public class PrincipalDetails implements UserDetails, OAuth2User {

    // 왜 final 지워야 에러가 사라지는지 모르겠다.
    private String kakaoId;
    private String password;
    private ProviderType providerType;
    private RoleType roleType;
    private Collection<GrantedAuthority> authorities;
    private Map<String, Object> attributes;
    private User user;

    public <T> PrincipalDetails(String kakaoId, String password, ProviderType providerType, RoleType user, List<T> singletonList) {
    }

    public static PrincipalDetails create(User user) {
        ProviderType providerType = ProviderType.valueOf(user.getUserType());
        return new PrincipalDetails(
                user.getKakaoId(), // 카카오 아이디 인지 user pk인지 헷갈림.
                user.getPassword(),
                providerType,
                RoleType.USER,
                Collections.singletonList(new SimpleGrantedAuthority(RoleType.USER.getCode()))
        );
    }
    public static PrincipalDetails create(User user, Map<String, Object> attributes) {
        PrincipalDetails userPrincipal = create(user);
        userPrincipal.setAttributes(attributes);

        return userPrincipal;
    }
    // 일반 로그인
    public PrincipalDetails(User user) {
        this.user = user;
    }

    // OAuth 로그인
    public PrincipalDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole();
            }
        });
        return collect;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getNickname();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
