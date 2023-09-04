package com.ssafy.jarviser.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TempTranscriptRecord {
    private ArrayList<StringBuilder> partScripts;
    private int partIndex;

    public void append(String part){
        if (partScripts == null){
            partScripts = new ArrayList<>();
            partScripts.add(new StringBuilder(part));
            partIndex = 0;
            return;
        }
        if (partScripts.get(partIndex).length() < 2000){ //1000글자 이하면
            partScripts.get(partIndex).append(part);
        }else{
            partScripts.add(new StringBuilder(part));
            partIndex++;
        }
    }
}
