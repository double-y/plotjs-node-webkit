/**
 * Created by yasudayousuke on 11/20/15.
 */
var React = require('react');
var ReactDom = require('react-dom');

var SampleChart = React.createClass({
    bindChart: function(dom){
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
            x: this.props.xData,
            y: this.props.yData,
        };

        var layout = {                     // all "layout" attributes: #layout
            title: 'simple example',  // more about "layout.title": #layout-title
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
                title: this.props.xLabel         // more about "layout.xaxis.title": #layout-xaxis-title
            },
            yaxis: {
                title: this.props.yLabel
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

        Plotly.plot( dom, [data], layout);
    },
    render: function(){
        return (
            <div
                ref={(dom) => {if(dom){this.bindChart(dom);}}}
                style={{width:"600px", height:"250px"}}
                class="chart-container">

            </div>)
    }
});

var DataNavigator = React.createClass({
    bindXDataChangeListener: function(dom){
       dom.addEventListener('change', (event) => {
           this.props.setDataState({xDataLabel: this.value})
       });
   },
   render: function(){
       var xOptions = this.props.fields.map((current, i) => {
           return (<option value={current.name} key={"xField" + i}>{current.name}</option>)
       });

       var yOptions = this.props.fields.map(function(current, i){
           return (<option value={current.name} key={"yField" + i}>{current.name}</option>)
       });

       return (
           <div>
               <label>x data</label>
               <select ref={(dom) => {
               if(dom){
                    this.bindXDataChangeListener(dom);
                    }
               }}>
                   {xOptions}
               </select>
               <label>y data</label>
               <select>
                   {yOptions}
               </select>
           </div>
       )
   }
});

var DataImporter = React.createClass({
    inputBind: function(dom){
        if( dom!= null ) dom.addEventListener('change', (event) => {
            console.log(dom);
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
                this.props.setData({
                    data:records,
                    fields: fields,
                    xDataLabel:fields[68].name,
                    yDataLabel:fields[12].name
                });
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
    getInitialState: function(){
      return {
          data:[],
          fields:[],
          xDataLabel: '',
          yDataLabel: ''
      }
    },
    setData: function(json){

        // Todo: json validation

        this.setState(json);
    },
    render: function(){
        var self = this;
        if(this.state.data.length > 0){
            var xData = this.state.data.map(function(obj){
                var originalValue =  obj[self.state.xDataLabel];
                var intValue = parseInt(originalValue);
                if(intValue != NaN){
                    return intValue;
                }else{
                    return originalValue;
                }
            });
            var yData = this.state.data.map(function(obj){
                var originalValue =  obj[self.state.yDataLabel];
                var intValue = parseInt(originalValue);
                if(intValue != NaN){
                    return intValue;
                }else{
                    return originalValue;
                }
            });
            return(
                <div>
                    <DataNavigator fields={this.state.fields} setDataState={this.setData}/>
                    <SampleChart xData={xData} xLabel={self.state.xDataLabel} yData={yData} yLabel={self.state.yDataLabel}/>
                </div>
            )
        }else{
            return(
                <DataImporter setData={this.setData}/>
            )
        }
    }
});

ReactDom.render(<DataContainer/>, document.getElementById('app'));