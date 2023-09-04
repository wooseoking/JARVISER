import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import styled from "styled-components";

const Speech = ({ speechPercentage = [] }) => {
  // 초기값 설정
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (!Array.isArray(speechPercentage)) {
      // 배열인지 확인
      return;
    }

    // 데이터 필터링: NaN이 아닌 값만 추출하여 newData 배열에 저장
    const newData = speechPercentage.filter((item) => !isNaN(item.percentage));

    // 중복 발화자 제거를 위한 Set 활용
    const uniqueSpeakers = new Set(newData.map((item) => item.name));

    // 중복이 제거된 newData 배열을 기반으로 그래프 데이터 구성
    const data = Array.from(uniqueSpeakers).map((speaker) => {
      const speakerData = newData.find((item) => item.name === speaker);
      return {
        title: speaker,
        value: speakerData.percentage,
        color: getRandomColor(),
      };
    });

    setGraphData(data);
  }, [speechPercentage]);

  return (
    <div>
      <TextBackground>
        <span>발화자 통계</span>
      </TextBackground>
      <PieChart
        data={graphData}
        reveal={100} // 그래프 레이블을 항상 표시하도록 설정
        lineWidth={100} // 그래프 두께 설정 (선택사항)
        label={({ dataEntry }) =>
          `${dataEntry.title}: ${dataEntry.value.toFixed(1)}%`
        } // 그래프 레이블 내용 설정 (소수점 1자리까지)
        labelStyle={{
          fontSize: "2px", // 그래프 레이블 폰트 크기 설정 (선택사항)
        }}
      />
    </div>
  );
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default Speech;

const TextBackground = styled.div`
  span {
    background-color: #cae1fd;
    padding: 8px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 10px;
  }
`;
