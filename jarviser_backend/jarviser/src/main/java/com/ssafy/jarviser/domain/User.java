package com.ssafy.jarviser.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "user")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"participants", "reservations"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    private String email;

    private String password;

    private String name;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user")
    private final List<Participant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private final List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private final List<AudioMessage> audioMessages = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    @Override
    public String getUsername() { //인증관련 메서드이기 때문에 return email
        return email;
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
