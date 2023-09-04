import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Legend,
  BarElement,
  Tooltip,
} from "chart.js";
import styled from "styled-components";

ChartJS.register(CategoryScale, LinearScale, Legend, BarElement, Tooltip);

const Keyword = ({ staticsOfKeywords = [] }) => {
  if (!Array.isArray(staticsOfKeywords) || staticsOfKeywords.length === 0) {
    return <p>No keyword data available.</p>;
  }

  // 중복된 키워드를 제거하는 로직 추가
  const uniqueKeywords = [];
  const data = {
    labels: [],
    datasets: [
      {
        label: "Keyword Usage",
        data: [],
        backgroundColor: [],
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  staticsOfKeywords.forEach((item) => {
    if (!uniqueKeywords.includes(item.keyword)) {
      uniqueKeywords.push(item.keyword);
      data.labels.push(item.keyword);
      data.datasets[0].data.push(item.percent);
      data.datasets[0].backgroundColor.push(getRandomColor());
    }
  });

  return (
    <div>
      <TextBackground>
        <span>회의 주요 키워드</span>
      </TextBackground>
      <Bar data={data} />
    </div>
  );
};

// 랜덤 컬러 생성 함수
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default Keyword;

const TextBackground = styled.div`
  span {
    background-color: #cae1fd;
    padding: 8px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 10px;
  }
`;
