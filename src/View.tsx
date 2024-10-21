import { useEffect, useRef } from "react";
import EchartView from "./Echart"
import * as echarts from 'echarts'
import 'echarts-gl'
import {getPie3D} from './options.js'
const Repution = ()=>{

    const myChartsDom = useRef(null);
    
    const colorList = ["#FF9900", "#FFCC33", "#99CC00"];
    const echartData = [
        {
            value: 130,
            name: "未上报行程单",
        },
        {
            value: 32,
            name: "途径购物店",
        },
        {
            value: 19,
            name: "行程偏移",
        },
    ];
    const seriesData = echartData.map((item, index) => {
        return {
            ...item,
            value: Number(Math.sqrt(item.value).toFixed(0)) * 100,
            actValue: item.value,
            label: {
                show: true,
                position: "outside",
                borderRadius: 5,
                padding: [0, 5, 3, -3],
                color: colorList[index],
                textStyle: {
                    fontSize: 14,
                },
                formatter: "{b}\n\n{c}\n\n{d}%",
            },
        };
    });
    const chart = useRef<any>(null);


    // 一个 ref 给实例
    useEffect(() => {
        if (myChartsDom.current && seriesData.length) {
            if (!chart.current) {
                chart.current = echarts.init(myChartsDom.current);
            }
            initChart();
        }

        return () => {
            if (chart.current) {
                chart.current.dispose();
            }
        };
    }, [seriesData]);

    const initChart = () => {
        const option = getPie3D(seriesData, 0.3);
        chart.current.setOption(option);
    };
    const option = getPie3D(seriesData,0.8)
    return (
        <>
        <div className="mycharts" ref={myChartsDom} style={{ width: "100%", height: "600px", backgroundColor: 'black' }}></div>
        {/* <EchartView option={option}></EchartView> */}
        </>
    )
}

export default Repution