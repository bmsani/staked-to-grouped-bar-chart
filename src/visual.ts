/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

// import "./../style/visual.less";
// import powerbi from "powerbi-visuals-api";
// import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
// import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
// import IVisual = powerbi.extensibility.visual.IVisual;
// import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
// import VisualObjectInstance = powerbi.VisualObjectInstance;
// import DataView = powerbi.DataView;
// import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import IVisualHost = powerbi.extensibility.IVisualHost;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    // private target: HTMLElement;
    // private updateCount: number;
    // private settings: VisualSettings;
    // private textNode: Text;

    private host: IVisualHost;
    private target: HTMLElement;
    private svg: Selection<any>;
    private barContainer: Selection<SVGElement>;
    private xAxis: Selection<SVGElement>;
    // private colors: IColorPalette;
    private settings: VisualSettings;
    private textNode: Text;
    private element: HTMLElement;
    private barSelection: d3.Selection<d3.BaseType, any, d3.BaseType, any>;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.host = options.host;
        this.element = options.element;

        this.svg = d3.select(options.element)
            .append('svg')
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        const dataView = options.dataViews[0];
        const viewport = options.viewport;
        const chartGrouped = this.settings.viewSettings.chartView
        console.log(chartGrouped);

        this.svg.selectAll("*").remove();

        // let margin = { top: 40, right: 10, bottom: 20, left: 10 }
        // let width: number = options.viewport.width - margin.left - margin.right;
        // let height: number = options.viewport.height - margin.top - margin.bottom;

        let n: number = 4
        let m = 43
        let xz: any = d3.range(m)
        let yz = d3.range(n).map(() => bumps(m))
        console.log(n, m, xz, yz);
        function bumps(m: number) {
            const values = [];

            // Initialize with uniform random values in [0.1, 0.2).
            for (let i = 0; i < m; ++i) {
                values[i] = 0.1 + 0.1 * Math.random();
            }

            // Add five random bumps.
            for (let j = 0; j < 5; ++j) {
                const x = 1 / (0.1 + Math.random());
                const y = 2 * Math.random() - 0.5;
                const z = 10 / (0.1 + Math.random());
                for (let i = 0; i < m; i++) {
                    const w = (i / m - y) * z;
                    values[i] += x * Math.exp(-w * w);
                }
            }

            // Ensure all values are positive.
            for (let i = 0; i < m; ++i) {
                values[i] = Math.max(0, values[i]);
            }

            return values;
        }


        // const y01z = d3.stack()
        //     .keys(d3.range(n))
        //     (d3.transpose(yz)) // stacked yz
        //     .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

        const stack: any = d3.stack()
            .keys(d3.range(n).map(String));

        const y01z = stack(d3.transpose(yz))
            .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

        console.log(y01z);
        const yMax = d3.max(yz, y => d3.max(y));
        // const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));
        const y1Max = d3.max(y01z, (d: any[]) => d3.max(d, (inner: any) => inner[1] as number)) as number;

        // const xz = d3.range(m);
        //     const yz = d3.range(n).map(() => this.bumps(m));

        const marginTop = 40;
        const marginRight = 10;
        const marginBottom = 20;
        const marginLeft = 10;
        const width: number = options.viewport.width - marginLeft - marginRight;
        const height: number = options.viewport.height - marginTop - marginBottom;

        const x = d3.scaleBand()
            .domain(xz)
            .range([0, viewport.width])
            .padding(0.08);

        console.log(x("8"));

        const y = d3.scaleLinear()
            .domain([0, y1Max])
            .range([height, 0]);

        // const xAxis = d3.axisBottom(x).tickSizeOuter(0).tickFormat((d, i) => `${i}`);

        const color = d3.scaleSequential(d3.interpolateBlues)
            .domain([-0.5 * n, 1.5 * n]);

        // let svg = this.svg

            
           let svg = this.svg.attr("width", width + marginLeft + marginRight)
            .attr("height", height + marginTop + marginBottom)
            .append("g")
            .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

            let layer = svg.selectAll(".layer")
            .data(y01z)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function (d, i) { return color(i); });

           let rect =  layer.selectAll("rect")
            .data((d: any) => d)
            .enter().append("rect")
            .attr("x", function (d, i) { return x(`${i}`); })
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height", 0);

            // rect.transition()
            //     .duration(500)
            //     .delay((d, i) => i * 20)
            //     .attr("x", (d, i) => x(`${i}`) + x.bandwidth() / n * d[2])
            //     .attr("width", x.bandwidth() / n)
            //     .transition()
            //     .attr("y", d => y(d[1] - d[0]))
            //     .attr("height", d => y(0) - y(d[1] - d[0]));

            function transitionGrouped() {
                y.domain([0, yMax]);
    
                rect.transition()
                    .duration(500)
                    .delay((d, i) => i * 20)
                    .attr("x", (d, i) => x(`${i}`) + x.bandwidth() / n * d[2])
                    .attr("width", x.bandwidth() / n)
                    .transition()
                    .attr("y", d => y(d[1] - d[0]))
                    .attr("height", d => y(0) - y(d[1] - d[0]));
            }
    
            function transitionStacked() {
                y.domain([0, y1Max]);
    
                rect.transition()
                    .duration(500)
                    .delay((d, i) => i * 20)
                    .attr("y", d => y(d[1]))
                    .attr("height", d => y(d[0]) - y(d[1]))
                    .transition()
                    .attr("x", (d, i) => x(`${i}`))
                    .attr("width", x.bandwidth());
            }

            if(chartGrouped){
                transitionGrouped();
            }else{
                transitionStacked();
            }

    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        // const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        // return VisualSettings.enumerateObjectInstances(settings, options);
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}