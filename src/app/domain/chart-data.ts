export interface ChartData {
    options: {
        scaleShowVerticalLines?: boolean,
        responsive: boolean,
        layout?: {
          padding?: {
            left?: number,
            right?: number,
            top?: number,
            bottom?: number
          }
        },
        scales?: {
          xAxes?: [{
              stacked?: boolean,
              ticks?: {
                min?: number,
                max?: number,
                stepSize?: number
              }
          }],
          yAxes: [{
              stacked?: boolean
              ticks?: {
                min?: number,
                max?: number,
                stepSize?: number
              }
          }]
        }
    },
    labels: string[],
    type: string,
    legend: boolean,
    data: {
      data: number[], 
      label: string
    }[]
}