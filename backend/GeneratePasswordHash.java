import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin";
        String hashedPassword = encoder.encode(password);
        System.out.println("Hashed password for 'admin': " + hashedPassword);
    }
}
