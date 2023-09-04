package com.ssafy.jarviser.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ReserveWrapperDto {
    @JsonProperty("reservatedRoom")
    private ReservatedMeetingDto reservatedMeetingDto;
    List<String> emails;
}
