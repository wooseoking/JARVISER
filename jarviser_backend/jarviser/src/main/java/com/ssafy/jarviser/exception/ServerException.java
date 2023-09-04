package com.ssafy.jarviser.exception;

public class ServerException extends RuntimeException{

    public ServerException(){
        super();
    }
    public ServerException(String message){
        super(message);
    }
}
