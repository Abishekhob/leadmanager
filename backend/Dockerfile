# Use lightweight JDK base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy backend project files
COPY . .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the application (skip tests)
RUN ./mvnw clean package -DskipTests

# Run the generated jar file
CMD ["java", "-jar", "target/*.jar"]
