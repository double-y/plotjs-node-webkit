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
        var self = this;
        return (<div ref={function(dom){self.bindChart(dom);}} style={{width:"600px", height:"250px"}}></div>)
    }
});

var DataNavigator = React.createClass({
   render: function(){
       return (
           <div>
               <input type='file'/>
           </div>
       )
   }
});

var DataImporter = React.createClass({
    inputBind: function(dom){
        var self = this;
        if( dom!= null ) dom.addEventListener('change', function(event){
            var dataFileManager = new DBFDataFileParser(this.value);
            var fields = [];
            var records = [];

            dataFileManager.dbpParser.on('header', function(head){
                fields = head.fields;
            });

            dataFileManager.dbpParser.on('record', function(record){
                records.push(record);
            });

            dataFileManager.dbpParser.on('end', function(p){
                self.props.setData({data:records, xDataLabel:fields[68].name,  yDataLabel:fields[12].name});
            });

            dataFileManager.dbpParser.parse();
        }, false);
        return 'file-input';
    },
    render: function(){
        var self = this;
        return(
            <div>
                <input ref={function(dom){self.inputBind(dom)}} type='file'/>
            </div>
        )
    }
});

var DataContainer = React.createClass({
    getInitialState: function(){
      return {
          data:[],
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
            xData = this.state.data.map(function(obj){
                var originalValue =  obj[self.state.xDataLabel];
                var intValue = parseInt(originalValue);
                console.log("x");
                console.log(originalValue);
                if(intValue != NaN){
                    return intValue;
                }else{
                    return originalValue;
                }
            });
            yData = this.state.data.map(function(obj){
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
                    <DataNavigator/>
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