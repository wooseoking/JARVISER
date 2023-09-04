package com.ssafy.jarviser.dto;

public class SessionUserDto {
    private Long userId;
    private String userName;

    public SessionUserDto(Long userId, String userName){
        this.userId = userId;
        this.userName = userName;
    }

    public Long getUserId(){
        return userId;
    }

    public String getUserName(){
        return userName;
    }

    public void setUserId(Long userId){
        this.userId = userId;
    }

    public void setUserName(String userName){
        this.userName = userName;
    }

    @Override
    public String toString(){
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                '}';
    }

}
