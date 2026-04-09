package com.facundo.backend.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String SECRET = "mi_clave_super_secreta_que_deberia_ser_mas_larga";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public String generateToken(String email, String role) {
        return Jwts.builder().setSubject(email).claim("role", role).setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) //1 hora
        .signWith(key).compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token)
        .getBody().getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }
    
}
