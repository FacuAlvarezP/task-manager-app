package com.facundo.backend.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final Key key;
    private final long expiration;

    // @Value lee el valor desde application.properties
    public JwtUtil(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.expiration}") long expiration
    ) {
        // HMAC-SHA256 requiere mínimo 32 caracteres
        if (secret.length() < 32) {
            throw new IllegalArgumentException(
                "JWT_SECRET debe tener al menos 32 caracteres. Longitud actual: " + secret.length()
            );
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = expiration;
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
            .setSubject(email)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(key)
            .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Ahora lanza excepciones específicas que podemos manejar
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    // Método para validar el token y distinguir el tipo de error
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw e; // Lo dejamos pasar para manejarlo específicamente
        } catch (MalformedJwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
}
