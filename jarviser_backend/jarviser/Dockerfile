# 실행 스테이지
FROM amazoncorretto:17.0.7-alpine

ARG JAR_FILE_PATH=build/libs/jarviser-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} jarviser.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/jarviser.jar"]
