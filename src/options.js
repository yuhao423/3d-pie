// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
export function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
    const midRatio = (startRatio + endRatio) / 2;
    const startRadian = startRatio * Math.PI * 2;
    const endRadian = endRatio * Math.PI * 2;
    const midRadian = midRatio * Math.PI * 2;
    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
    }
    k = typeof k !== 'undefined' ? k : 1 / 3;
    const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    // 鼠标滑过时外环放大大小
    const hoverRate = isHovered ? 1.05 : 1;
    // 返回曲面参数方程
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32,
        },

        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
        },

        x: function (u, v) {
            if (u < startRadian) {
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y: function (u, v) {
            if (u < startRadian) {
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z: function (u, v) {
            if (u < -Math.PI * 0.5) {
                return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
                // return Math.sin(u);
                return Math.sin(u) * h * .1;
            }
            return Math.sin(v) > 0 ? 1 * h * .1 : -1;
            return Math.sin(v) > 0 ? 60 : -1;

        },
    };
}

export function fomatFloat(num, n) {
    var f = parseFloat(num);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂   
    var s = f.toString();
    var rs = s.indexOf('.');
    //判定如果是整数，增加小数点再补0
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + n) {
        s += '0';
    }
    return s;
}

//获取3d丙图的最高扇区的高度
export function getHeight3D(series, height) {
        series.sort((a, b) => {
            return (b.pieData.value - a.pieData.value);
        })
        return height * 25 / series[0].pieData.value;
    }

// 生成模拟 3D 饼图的配置项
export function getPie3D(pieData, internalDiameterRatio) {
    const series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    const legendData = [];
    //add
    let legendBfb = [];
    let k = 1 -internalDiameterRatio 
    // const k =
    //     typeof internalDiameterRatio !== 'undefined'
    //         ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
    //         : 1 / 3;
    pieData.sort((a, b) => {
        return (b.value - a.value);
    });
    for (let i = 0; i < pieData.length; i += 1) {
        sumValue += pieData[i].value;
        const seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false,
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k,
            },
            center: ['50%', '50%']
        };
        if (typeof pieData[i].itemStyle !== 'undefined') {
            const { itemStyle } = pieData[i];
            // eslint-disable-next-line no-unused-expressions
            typeof pieData[i].itemStyle.color !== 'undefined' ? (itemStyle.color = pieData[i].itemStyle.color) : null;
            // eslint-disable-next-line no-unused-expressions
            typeof pieData[i].itemStyle.opacity !== 'undefined'
                ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
                : null;

            seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
    }
    for (let i = 0; i < series.length; i += 1) {
        endValue = startValue + series[i].pieData.value;
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = getParametricEquation(
            series[i].pieData.startRatio,
            series[i].pieData.endRatio,
            // true,  //空格
            false,
            false,
            k,
            series[i].pieData.value || 10  //在此处传入饼图初始高度h
        );
        startValue = endValue;
        //add
        let bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
        legendData.push({
            name: series[i].name,
            value: bfb
        });
        legendBfb.push({
            name: series[i].name,
            value: bfb
        });
        //   legendData.push(series[i].name);
    }


    //待加入 boxHeight
    let boxHeight = getHeight3D(series, 26);//通过传参设定3d饼/环的高度，26代表26px
    console.log(boxHeight,'boxHeight');
    
    //tool 指引线

    // series.push({
    //     name: 'pie2d',
    //     type: 'pie',
    //     label: {
    //         color: '#ffffff',
    //         opacity: 1,
    //         fontStyle: 'normal',
    //         fontSize: 12,
    //         fontFamily: 'Microsoft YaHei',
    //         formatter: (params) => {
    //             return `${params.data.name}\n${params.data.value}\n${((params.data.value / _.sumBy(pieData, 'value')) * 100).toFixed(2)}%`
    //         }
    //     },
    //     labelLine: {
    //         length: 60,
    //     },
    //     startAngle: -30, //起始角度，支持范围[0, 360]。
    //     clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    //     radius: ['40%', '60%'],
    //     center: ['50%', '50%'],
    //     data: pieData,
    //     itemStyle: {
    //         opacity: 0,
    //     },
    // });

    // 底部透明的圆环
    //    series.push({
    //       name: 'mouseoutSeries',
    //       type: 'surface',
    //       parametric: true,
    //       wireframe: {
    //          show: false,
    //       },
    //       itemStyle: {
    //          opacity: 1,
    //          color: '#102b6f',
    //       },
    //       parametricEquation: {
    //          u: {
    //             min: 0,
    //             max: Math.PI * 2,
    //             step: Math.PI / 20,
    //          },
    //          v: {
    //             min: 0,
    //             max: Math.PI,
    //             step: Math.PI / 20,
    //          },
    //          x: function (u, v) {
    //             return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 3.75;
    //          },
    //          y: function (u, v) {
    //             return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 3.75;
    //          },
    //          z: function (u, v) {
    //             return Math.cos(v) > 0 ? -5 : -7;
    //          },
    //       },
    //    });

    // 准备待返回的配置项，把准备好的series 传入。
    
    // const option = {
    //     backgroundColor: "#123756",
    //     title: {
    //         show: false,
    //     },
    //     // legend: {
    //     //   show: false,
    //     // },
    //     color: [
    //         'rgba(111,57,244,1)',
    //         'rgba(217,36,242,1)',
    //         'rgba(51,210,186,1)',
    //     ],
    //     tooltip: {
    //         formatter: (params) => {
    //             if (params.seriesName !== 'mouseoutSeries') {
    //                 return `${params.marker}${params.seriesName}：${pieData[params.seriesIndex].value}`;
    //             }
    //             return '';
    //         },
    //     },
    //     xAxis3D: {
    //         min: -1,
    //         max: 1,
    //     },
    //     yAxis3D: {
    //         min: -1,
    //         max: 1,
    //     },
    //     zAxis3D: {
    //         min: -1,
    //         max: 1,
    //     },
    //     grid3D: {
    //         show: false,
    //         top: '-10%',
    //         boxHeight: 1,//修改立体饼图的高度
    //         viewControl: {
    //             // 3d效果可以放大、旋转等，
    //             alpha: 30,//饼图翻转的程度
    //             beta: 30,
    //             rotateSensitivity: 1,
    //             zoomSensitivity: 0,
    //             panSensitivity: 0,
    //             autoRotate: false,//是否自动旋转
    //             distance: 300,//距离越小看到的饼图越大
    //         },

    //     },
    //     series,
    // };

    let option = {
            legend: {
                data: legendData,
                orient: 'horizontal',
                left: 10,
                top: 10,
                itemGap: 10,
                textStyle: {
                    color: '#A1E2FF'
                },
                show: true,
                icon: "circle",
                formatter: function(param) {
                    let item = legendBfb.filter(item => item.name == param)[0];
                    let bfs = fomatFloat(item.value * 100, 2) + "%";
                    return `${item.name}  ${bfs}`;
                }
            },
            labelLine: {
                show: true,
                lineStyle: {
                    color: '#7BC0CB'
                }
            },
            label: {
                show: true,
                position: 'outside',
                rich: {
                    b: {
                        color: '#7BC0CB',
                        fontSize: 12,
                        lineHeight: 20
                    },
                    c: {
                        fontSize: 16,
                    },
                },
                formatter: '{b|{b} \n}{c|{c}}{b|  条}',

            },
            tooltip: { 
                formatter: params => {
                    if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
                        let bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) *
                            100).toFixed(2);
                        return `${params.seriesName}<br/>` +
                            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                            `${ bfb }%`;
                    }
                }
            },
            xAxis3D: {
                min: -1,
                max: 1
            },
            yAxis3D: {
                min: -1,
                max: 1
            },
            zAxis3D: {
                min: -1,
                max: 1
            },
            grid3D: {
                show: false,
                boxHeight: boxHeight, //圆环的高度
                viewControl: { //3d效果可以放大、旋转等，请自己去查看官方配置
                    alpha: 40, //角度
                    distance: 300,//调整视角到主体的距离，类似调整zoom
                    rotateSensitivity: 0, //设置为0无法旋转
                    zoomSensitivity: 0, //设置为0无法缩放
                    panSensitivity: 0, //设置为0无法平移
                    autoRotate: true //自动旋转
                }
            },
            series: series
        };
    return option;
}

