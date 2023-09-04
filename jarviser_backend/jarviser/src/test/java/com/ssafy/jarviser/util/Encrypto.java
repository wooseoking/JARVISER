package com.ssafy.jarviser.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class Encrypto {
    @Autowired
    AESEncryptionUtil aesEncryptionUtil;

    @Test
    @DisplayName("EncryptoTest")
    void testEncrypt() throws Exception {
        System.out.println("EncryptoTest");
        long id = 1;
        String encrypt = aesEncryptionUtil.encrypt(Long.toString(id));
        System.out.println(encrypt);

        String decrypt = aesEncryptionUtil.decrypt("fRsFnxwhA7frdnfFMjNPKA==");
//        System.out.println(;
//        String decrypt = aesEncryptionUtil.decrypt(encrypt);

        Assertions.assertEquals("1",decrypt);
    }
}
