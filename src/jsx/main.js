/**
 * Created by yasudayousuke on 11/20/15.
 */
var React = require('react');
var ReactDom = require('react-dom');

var HistoGramListViewer = React.createClass({
    getInitialState: function(){
        return {
            fields: [],
            data: [],
        }
    },
    componentDidMount: function(){
        this.refs.hist_container;
    },
    render: function(){
        var _this = this;
        var histograms = this.state.fields.map(function(field, index){
            var data = _this.state.data.map(function(data, data_index){
                return data[field];
            });
            return (<HistoGram data={data} title={field} key={"histogram"+index}></HistoGram>)
        });
        return (<ul ref="hist_container">{histograms}</ul>)
    }
});

var HistoGram = React.createClass({
    getInitialState: function(){
        return {
            data: []
        }
    },
    componentDidMount: function(){
        var data=[{
            x: this.props.data,
            type: 'histogram'
        }];
        var layout={
            title: this.props.title
        };
        Plotly.newPlot(this.refs.hist_container, data, layout);
    },
    render: function(){
        return (<li><div ref="hist_container"></div></li>)
    }
});

var ChartContainer = React.createClass({
    getInitialState: function(){
      return {
          data: [],
          xLabel: '',
          yLabel: '',
      }
    },
    getDataArray(key){
        return this.state.data.map((obj) => {
            var originalValue =  obj[key];
            var intValue = parseInt(originalValue);
            if(intValue != NaN){
                return intValue;
            }else{
                return originalValue;
            }
        });
    },
    updateChart: function(newState){
        var dom = this.refs.chart_dom;
        var data = {
            type: 'scatter',
            marker: {         // marker is an object, valid marker keys: #scatter-marker
                color: 'rgb(16, 32, 77)', // more about "marker.color": #scatter-marker-color
                size: 1
            },
            line: {
                width: 0
            },
            mode: 'markers',
            x: this.getDataArray(newState.xLabel),
            y: this.getDataArray(newState.yLabel),
        };

        var layout = {                     // all "layout" attributes: #layout
            title: 'simple example',  // more about "layout.title": #layout-title
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
                title: newState.xLabel         // more about "layout.xaxis.title": #layout-xaxis-title
            },
            yaxis: {
                title: newState.yLabel
            },
            margin: { t: 0 }
        }
        dom.data = [data];
        Plotly.redraw(dom);
        Plotly.relayout(dom, layout);
    },
    componentDidMount: function(){
        var data = {
            type: 'scatter',
            marker: {         // marker is an object, valid marker keys: #scatter-marker
                color: 'rgb(16, 32, 77)', // more about "marker.color": #scatter-marker-color
                size: 1
            },
            line: {
                width: 0
            },
            mode: 'markers',
            x: [],
            y: [],
        };
        var layout = {                     // all "layout" attributes: #layout
            title: 'simple example',  // more about "layout.title": #layout-title
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
                title: "x title"         // more about "layout.xaxis.title": #layout-xaxis-title
            },
            yaxis: {
                title: "y title"
            },
            /*annotations: [            // all "annotation" attributes: #layout-annotations
             {
             text: 'simple annotation',    // #layout-annotations-text
             x: 0,                         // #layout-annotations-x
             xref: 'paper',                // #layout-annotations-xref
             y: 0,                         // #layout-annotations-y
             yref: 'paper'                 // #layout-annotations-yref
             }
             ],*/
            margin: { t: 0 }
        }
        Plotly.plot(this.refs.chart_dom, [], layout);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        this.updateChart(nextState);
        return false;
    },
    render: function(){
        return (
            <div
                ref="chart_dom"
                style={{width:"100%", height:"500px"}}>
            </div>)
    }
});

var DataNavigator = React.createClass({
    getInitialState: function(){
        return {
            fields: []
        }
    },
    bindXDataChangeListener: function(dom){
       dom.addEventListener('change', (event) => {
           this.props.changeChartState({xLabel: dom.value})
       });
    },
    componentDidMount: function(){
        this.refs.x_select.addEventListener('change', (event) => {
            this.props.changeChartState({xLabel: this.refs.x_select.value})
        });
        this.refs.y_select.addEventListener('change', (event) => {
            this.props.changeChartState({yLabel: this.refs.y_select.value})
        });
    },
   render: function(){
       var xOptions = this.state.fields.map((current, i) => {
           return (<option value={current.name} key={"xField" + i}>{current}</option>)
       });

       var yOptions = this.state.fields.map(function(current, i){
           return (<option value={current.name} key={"yField" + i}>{current}</option>)
       });

       return (
           <div>
               <label>x data</label>
               <select ref="x_select">
                   {xOptions}
               </select>
               <label>y data</label>
               <select ref="y_select">
                   {yOptions}
               </select>
           </div>
       )
   }
});

var DataImporter = React.createClass({
    inputBind: function(dom){
        if( dom!= null ) dom.addEventListener('change', (event) => {
            var dataFileManager = new DBFDataFileParser(dom.value);
            var fields = [];
            var records = [];

            dataFileManager.dbpParser.on('header', function(head){
                fields = head.fields;
            });

            dataFileManager.dbpParser.on('record', function(record){
                records.push(record);
            });

            dataFileManager.dbpParser.on('end', (p) => {
                var field_name_list = fields.map((field)=> {
                    return field.name;
                });
                this.props.changeDataSet(records, field_name_list);
            });

            dataFileManager.dbpParser.parse();
        }, false);
        return 'file-input';
    },
    render: function(){
        var self = this;
        return(
            <div>
                <input ref={function(dom){if(dom) self.inputBind(dom);}} type='file'/>
            </div>
        )
    }
});

var DataContainer = React.createClass({
    changeDataSet: function(data_array, field_name_list){
        this.refs.hist_gram_list.setState({data: data_array});
        this.refs.hist_gram_list.setState({fields: field_name_list});
    },
    changeChartState: function(json){
        this.refs.chart_container.setState(json);
    },
    render: function(){
        return(
            <div>
                <HistoGramListViewer ref="hist_gram_list"/>
                <DataNavigator ref="data_navigator" changeDataSet={this.changeDataSet} changeChartState={this.changeChartState}/>
                <DataImporter ref="data_importer" changeDataSet={this.changeDataSet}/>
            </div>
        )
    }
});

ReactDom.render(<DataContainer/>, document.getElementById('app'));