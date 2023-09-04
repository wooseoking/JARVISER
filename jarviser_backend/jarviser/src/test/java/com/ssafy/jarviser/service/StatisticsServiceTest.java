package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.Meeting;
import com.ssafy.jarviser.dto.TempTranscriptRecord;
import com.ssafy.jarviser.repository.MeetingRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class StatisticsServiceTest {

    @Autowired
    StatisticsService statisticsService;

    @Autowired
    MeetingService meetingService;

    @BeforeEach
    public void init(){
        Meeting meeting = Meeting.builder()
                .id(1L)
                .meetingName("Weekly Team Meeting")
                .hostId(123L)
                .meetingUrl("https://example.com/meeting")
                .startTime(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("이름: 10개의 대화 발화 추가")
    void testAccumulateTranscriptMultipleTexts() {
        String[] texts = {
                "김태현: 안녕하세요. 오늘은 데이터베이스 성능 고도화에 대한 회의를 해보겠습니다.",
                "문홍웅: 네 좋습니다. 정규화에 대해 얘기해보죠.",
                "김태현: 정규화를 통해 중복을 제거하면 성능이 향상될 것입니다.",
                "문홍웅: 동의합니다. 인덱싱 전략도 함께 고려해야겠네요.",
                "김태현: 인덱싱은 조회 성능을 크게 향상시킬 수 있으니 중요하겠습니다.",
                "문홍웅: 쿼리 최적화도 잊지 말아야겠어요.",
                "김태현: 맞아요. 실행 계획을 살펴보며 최적화해야겠습니다.",
                "문홍웅: 또한, 캐싱 전략도 중요할 것 같습니다.",
                "김태현: 캐싱은 반복적인 쿼리의 성능을 크게 향상시킬 수 있겠네요.",
                "문홍웅: 이상으로 성능 고도화 전략 회의를 마치겠습니다. 감사합니다.",
                "김태현: 그렇습니다. 데이터베이스의 성능 최적화는 업무 효율성을 높이는 중요한 과제입니다.",
                "문홍웅: 네, 효율적인 데이터 처리는 우리의 시스템을 경쟁력 있게 만들어줄 것입니다.",
                "김태현: 그래서 우리는 정규화와 인덱싱을 중점적으로 개선하고, 쿼리 최적화와 캐싱 전략도 함께 고려해야 합니다.",
                "문홍웅: 맞아요. 특히 인덱스를 적절히 활용하면 빠른 데이터 접근이 가능해질 것입니다.",
                "김태현: 그리고 실행 계획을 분석하여 쿼리 성능을 최적화하고, 캐싱으로 반복적인 작업을 효과적으로 처리할 수 있을 것입니다.",
                "문홍웅: 우리의 노력을 통해 시스템의 성능을 한 단계 더 향상시킬 수 있을 것입니다.",
                "김태현: 따라서, 데이터베이스 성능 최적화 전략 회의는 매우 중요한 의미를 가지고 있습니다.",
                "문홍웅: 마지막으로 모두에게 감사 인사를 전하며 회의를 마치겠습니다.",
                "김태현: 그럼 모두 수고하셨습니다. 좋은 하루 되세요!",
                "안나: 여기서 진행되는 데이터베이스 성능 최적화 회의에 참여하게 돼서 기뻐요.",
                "존: 그렇죠. 우리는 시스템의 성능을 향상시키기 위해 다양한 전략을 고민해봐야 합니다.",
                "안나: 예, 정규화와 인덱싱을 통해 데이터를 더 효율적으로 관리하고 조회 성능을 개선할 수 있을 것 같아요.",
                "존: 그리고 쿼리 최적화와 실행 계획 분석을 통해 데이터베이스 작업을 최적화하고 반복적인 작업을 효율적으로 처리할 수 있습니다.",
                "안나: 또한, 캐싱 전략을 고려하여 빠른 응답 시간을 유지하며 사용자 경험을 향상시킬 수 있을 것입니다.",
                "존: 이번 회의에서는 이러한 다양한 전략을 조합하여 데이터베이스 성능을 최적화하는 방법에 대해 논의하고 결정해보겠습니다.",
                "안나: 회의가 성공적으로 마무리되었을 때 우리 시스템이 더욱 뛰어난 성능을 보일 수 있도록 노력하겠습니다.",
                "존: 그럼 이번 회의에서 나온 아이디어들을 실제로 적용해보며 더 나은 결과를 얻을 수 있도록 해봅시다.",
                "안나: 네, 각자의 노력과 협력을 통해 우리 시스템을 더욱 발전시켜나갈 수 있을 거라 믿습니다.",
                "존: 이상으로 이번 회의를 마치도록 하겠습니다. 모두 수고하셨습니다!",
                "태현: 아 이제 밥먹으러 갈까 뭐먹지?",
                "태현: 아 이제 밥먹으러 갈까 뭐먹지?",
                "지은: 그래, 배고파졌어. 메뉴를 정해봐요.",
                "태현: 우리 오랜만에 중식 먹는 건 어때?",
                "지은: 좋아요! 중국집으로 가볼까요?",
                "태현: 그럼 중국집은 어떤 메뉴가 있을까 찾아볼게요.",
                "지은: 메뉴판을 보면서 고르는 게 더 재미있을 것 같아요.",
                "태현: 맞아요. 직접 골라보면 더 맛있게 느껴지지 않을까요?",
                "지은: 그래도 메뉴가 많아서 고르기 어려울 것 같아요.",
                "태현: 그렇다면, 우리 각자 원하는 메뉴를 조금씩 시키면 어떨까요?",
                "지은: 그게 좋을 것 같아요. 다양한 종류를 맛볼 수 있겠죠.",
                "태현: 그렇게 하면 한 가지 메뉴만 먹는 게 아니라 여러 가지를 함께 즐길 수 있어요.",
                "지은: 동의해요. 그럼 각자 조금씩 골라볼까요?",
                "태현: 좋아요! 어떤 메뉴가 있는지 먼저 살펴볼게요.",
                "지은: 기다릴게요. 그동안 나는 음료를 골라볼까요?",
                "태현: 그래요. 음료도 중요하니까 맛있는 걸로 골라주세요.",
                "지은: 알겠어요. 중식 메뉴를 골라보면서 먹을 음식을 기대해봐요.",
                "태현: 네, 메뉴를 선택하면서 기대감이 더 커지네요.",
                "지은: 그렇게 골라놓은 메뉴로 푸짐한 저녁식사를 즐겨봅시다!",
                "태현: 그래요! 배고파서 더 맛있게 먹을 수 있을 거예요.",
                "지은: 이렇게 중식 메뉴를 먹으며 오랜만에 대화도 나누면 좋겠어요.",
                "태현: 네, 함께 맛있는 음식과 대화를 즐기면 더 기분이 좋아질 거예요.",
                "지은: 그럼 지금부터 메뉴를 골라볼까요? 기대돼요!",
                "태현: 응, 메뉴를 골라가면서 맛있는 시간을 보내봐요!",
        };

        for (String text : texts) {
            statisticsService.accumulateTranscript(1L, text);
        }

        // 메서드를 통해 저장된 대화 가져오기
        List<StringBuilder> accumulatedTranscripts = statisticsService.getAccumulatedTranscriptById(1L);

        for (StringBuilder sb : accumulatedTranscripts){
            log.info("각각의 요소: {}", sb);
        }

        // 대화의 수와 내용 확인
        assertNotNull(accumulatedTranscripts, "Accumulated transcripts should not be null");

        log.info("accumulated: {}", accumulatedTranscripts);
        log.info("accumulatedSize: {}", accumulatedTranscripts.size());
    }

    @Test
    public void summarizeTest(){

        CompletableFuture<Void> future = statisticsService.summarizeTranscript(1L);
        future.join();

    }

}