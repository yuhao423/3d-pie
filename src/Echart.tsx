
import React, { useMemo, useRef } from 'react'
import classNames from 'classnames'
import { useSize } from 'ahooks'
export const html = (option: any = {}, size: { width?: number, height?: number } = {}) => {
  return /* html */`
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/echarts.min.js" integrity="sha512-VdqgeoWrVJcsDXFlQEKqE5MyhaIgB9yXUVaiUa8DR2J4Lr1uWcFm+ZH/YnzV5WqgKf4GPyHQ64vVLgzqGIchyw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts-gl/2.0.8/echarts-gl.min.js" integrity="sha512-BU2/2iqpnDMN4hyqWPLo5MsqlkOF2xOVC8we4iZVZ7xhGfkk7tSiLnxPJb0xZrbhjmtb7qBQ7w3WdAtF13b1sQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  </head>
  <style>
      * {
          padding:0px;
          margin:0px;
      }
      body {
          width:${size.width}px;
          height:${size.height}px;
          overflow:hidden;
      }
      #main {
          width: 100%;
          height:100%;
      }
  </style>
  <body>
      <div id="main"></div>
      <script type="text/javascript">
        console.log(echarts,'echarts')
          const myChart = echarts.init(document.getElementById('main'));
          const options = ${typeof option === 'string' ? option : JSON.stringify(option)};
          console.log(options,'s3')
          myChart.setOption(options);

  </script>
  </body>
  </html>
  `
}
export interface EChartsViewProps extends React.HTMLAttributes<HTMLDivElement> {
  option: any,
  echartsStyle?: string,
  // childDom?: React.ReactNode
}
const EchartView:React.FC<EChartsViewProps> = (_props)=>{

  const {style,className,option,...props} = _props
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)

  const doc = useMemo(()=>{
    return html(option,size)
  },[size?.height,size?.width,option])
  console.log(doc,'yu-');
  
  return (
    <div className={classNames(className)} ref={ref} style={{...style}} {...props}>
      <iframe srcDoc={doc} style={{ width: '100%', height: '100%', outline: 'none', border: 'none' }}></iframe>
   </div>
  )
}


export default EchartView