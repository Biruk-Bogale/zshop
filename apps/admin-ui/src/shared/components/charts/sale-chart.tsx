"use client";
import Chart, { Props } from "react-apexcharts";

export const SalesChart = ({
  ordersData,
}: {
  ordersData?: {
    month: string;
    count: number;
  }[];
}) => {
  const chartSeries: Props["series"] = [
    {
      name: "Sales",
      data: ordersData?.map((data) => data.count) || [
        31, 40, 28, 51, 42, 109, 100,
      ],
    },
  ];

  const chartOptions: Props["options"] = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories:
        ordersData?.map((data) => data.month) || [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        ],
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Monthly Sales",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
  };

  return <Chart options={chartOptions} series={chartSeries} type="line" height={350} />;
};
