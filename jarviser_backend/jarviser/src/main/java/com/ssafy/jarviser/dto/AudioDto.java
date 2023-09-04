package com.ssafy.jarviser.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class AudioDto {
    private File file;
}
