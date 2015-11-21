/**
 * Created by yasudayousuke on 11/20/15.
 */
var React = require('react');
var ReactDom = require('react-dom');

var SampleChart = React.createClass({
    bindChart: function(dom){
        Plotly.plot( dom, [{
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 4, 8, 16] }], {
            margin: { t: 0 } } );
    },
    render: function(){
        var self = this;
        return (<div ref={function(dom){self.bindChart(dom);}} style={{width:"600px", height:"250px"}}></div>)
    }
});

ReactDom.render(<SampleChart/>, document.getElementById('app'));