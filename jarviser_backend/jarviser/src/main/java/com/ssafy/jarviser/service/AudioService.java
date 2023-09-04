package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.AudioMessage;
import com.ssafy.jarviser.exception.ClientException;
import com.ssafy.jarviser.exception.ServerException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.List;

public interface AudioService {
    public Long getTimeOfAudio(MultipartFile audioFile) throws ClientException;

    public String saveAudioFile(String mId, long userId, long startTime, MultipartFile audioFile)
            throws ServerException;

    public List<AudioMessage> getAllSttByMeetingId(long meetingId);
    public void moveStt(long myId, long upId, long downId) throws ServerException;

    public void removeAudioFile(String filePath) throws ServerException;

    public String getStt(String filePath) throws ServerException;

    public Long createAudioMessage(Long userId, String mId, Long StartTime, String filePath, String stt)
            throws ServerException;

    public Map<String, Double> staticsOfAudioMessages(List<AudioMessage> audioMessages) throws Exception;

    AudioMessage findByAudioMessageId(long audioMessageId);
    //Update
    Long updateByAudioMessageId(long audioMessageId,String changedContext);

}
