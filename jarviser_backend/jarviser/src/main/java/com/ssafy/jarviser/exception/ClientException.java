package com.ssafy.jarviser.exception;

public class ClientException extends RuntimeException{
    public ClientException(){
        super();
    }
    public ClientException(String message){
        super(message);
    }
}
